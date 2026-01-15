import React, { useState, useEffect, useRef } from 'react';

export default function TimeTracker({ session, onSave, onTimeChange, readOnly }) {
  // Time state
  const [gameTime, setGameTime] = useState(session?.gameTime || {
    year: 2387,
    day: 1,
    hour: 12,
    minute: 0,
    totalMinutes: 0
  });

  // Real-world session tracking
  const [sessionStart, setSessionStart] = useState(session?.sessionStart || null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  // Auto-advance settings
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [advanceSpeed, setAdvanceSpeed] = useState(1); // Minutes per second

  // Time events
  const [timeEvents, setTimeEvents] = useState(session?.timeEvents || []);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    name: '',
    description: '',
    targetTime: { year: 2387, day: 1, hour: 0, minute: 0 },
    type: 'deadline',
    recurring: false,
    recurInterval: 1,
    recurUnit: 'day',
    alertBefore: 0,
    completed: false,
    color: 'blue'
  });

  // Time log
  const [timeLog, setTimeLog] = useState(session?.timeLog || []);
  const [showLog, setShowLog] = useState(false);

  // UI state
  const [showQuickSkip, setShowQuickSkip] = useState(false);
  const [showManualEdit, setShowManualEdit] = useState(false);
  const [manualForm, setManualForm] = useState({ year: 2387, day: 1, hour: 12, minute: 0 });
  const [showSettings, setShowSettings] = useState(false);

  // Calendar settings
  const [calendarSettings, setCalendarSettings] = useState(session?.calendarSettings || {
    daysPerYear: 365,
    hoursPerDay: 24,
    minutesPerHour: 60,
    dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    daysPerMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    useEarthCalendar: true
  });

  const intervalRef = useRef(null);
  const sessionTimerRef = useRef(null);

  // Calculate total minutes from time object
  const calculateTotalMinutes = (time) => {
    const { year, day, hour, minute } = time;
    const { daysPerYear, hoursPerDay, minutesPerHour } = calendarSettings;
    return (year * daysPerYear * hoursPerDay * minutesPerHour) +
           (day * hoursPerDay * minutesPerHour) +
           (hour * minutesPerHour) +
           minute;
  };

  // Convert total minutes back to time object
  const minutesToTime = (totalMins) => {
    const { daysPerYear, hoursPerDay, minutesPerHour } = calendarSettings;

    let remaining = totalMins;
    const year = Math.floor(remaining / (daysPerYear * hoursPerDay * minutesPerHour));
    remaining -= year * daysPerYear * hoursPerDay * minutesPerHour;

    const day = Math.floor(remaining / (hoursPerDay * minutesPerHour));
    remaining -= day * hoursPerDay * minutesPerHour;

    const hour = Math.floor(remaining / minutesPerHour);
    remaining -= hour * minutesPerHour;

    const minute = remaining;

    return { year, day, hour, minute, totalMinutes: totalMins };
  };

  // Sync with session
  useEffect(() => {
    if (session?.gameTime) {
      setGameTime(session.gameTime);
    }
    if (session?.timeEvents) {
      setTimeEvents(session.timeEvents);
    }
    if (session?.timeLog) {
      setTimeLog(session.timeLog);
    }
    if (session?.sessionStart) {
      setSessionStart(session.sessionStart);
    }
    if (session?.calendarSettings) {
      setCalendarSettings(session.calendarSettings);
    }
  }, [session]);

  // Save changes
  useEffect(() => {
    if (onSave) {
      onSave({
        ...session,
        gameTime,
        timeEvents,
        timeLog,
        sessionStart,
        calendarSettings
      });
    }
  }, [gameTime, timeEvents, timeLog, sessionStart, calendarSettings]);

  // Notify parent of time changes
  useEffect(() => {
    if (onTimeChange) {
      onTimeChange(gameTime, timeEvents);
    }
  }, [gameTime]);

  // Auto-advance timer
  useEffect(() => {
    if (autoAdvance && !isPaused && !readOnly) {
      intervalRef.current = setInterval(() => {
        advanceTime(advanceSpeed);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoAdvance, isPaused, advanceSpeed, readOnly]);

  // Session duration timer
  useEffect(() => {
    if (!isPaused && sessionStart) {
      sessionTimerRef.current = setInterval(() => {
        const elapsed = Date.now() - new Date(sessionStart).getTime();
        setSessionDuration(Math.floor(elapsed / 1000));
      }, 1000);
    } else {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    }

    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, [isPaused, sessionStart]);

  // Start/stop session
  const toggleSession = () => {
    if (isPaused) {
      if (!sessionStart) {
        setSessionStart(new Date().toISOString());
      }
      setIsPaused(false);
      logTime('Session Started', 0);
    } else {
      setIsPaused(true);
      logTime('Session Paused', 0);
    }
  };

  // Advance time by minutes
  const advanceTime = (minutes, reason = null) => {
    const newTotalMinutes = gameTime.totalMinutes + minutes;
    const newTime = minutesToTime(newTotalMinutes);
    setGameTime(newTime);

    if (reason && minutes !== 0) {
      logTime(reason, minutes);
    }

    // Check for triggered events
    checkTriggeredEvents(newTime);
  };

  // Set absolute time
  const setAbsoluteTime = (newTime) => {
    const totalMins = calculateTotalMinutes(newTime);
    const completeTime = { ...newTime, totalMinutes: totalMins };
    const diff = totalMins - gameTime.totalMinutes;

    setGameTime(completeTime);
    logTime('Manual Time Adjustment', diff);
    checkTriggeredEvents(completeTime);
  };

  // Log time change
  const logTime = (reason, minutesChanged) => {
    const entry = {
      timestamp: new Date().toISOString(),
      gameTime: { ...gameTime },
      reason,
      minutesChanged,
      sessionNumber: session?.sessionNumber || 'Unknown'
    };
    setTimeLog([entry, ...timeLog]);
  };

  // Check for triggered events
  const checkTriggeredEvents = (currentTime) => {
    const currentTotal = currentTime.totalMinutes;

    timeEvents.forEach((event, index) => {
      if (event.completed) return;

      const eventTotal = calculateTotalMinutes(event.targetTime);

      // Check if event time has been reached or passed
      if (currentTotal >= eventTotal && gameTime.totalMinutes < eventTotal) {
        // Trigger alert
        alert(`🕐 TIME EVENT TRIGGERED: ${event.name}\n\n${event.description || 'No description'}`);

        // Mark as completed if not recurring
        if (!event.recurring) {
          const newEvents = [...timeEvents];
          newEvents[index] = { ...event, completed: true };
          setTimeEvents(newEvents);
        } else {
          // Schedule next occurrence
          const nextEvent = scheduleNextRecurrence(event);
          const newEvents = [...timeEvents];
          newEvents[index] = nextEvent;
          setTimeEvents(newEvents);
        }
      }

      // Check for alerts
      if (event.alertBefore > 0) {
        const alertTime = eventTotal - event.alertBefore;
        if (currentTotal >= alertTime && gameTime.totalMinutes < alertTime) {
          alert(`⏰ UPCOMING EVENT: ${event.name}\n\nStarts in ${event.alertBefore} minutes\n\n${event.description || ''}`);
        }
      }
    });
  };

  // Schedule next recurrence
  const scheduleNextRecurrence = (event) => {
    const { recurInterval, recurUnit } = event;
    let minutesToAdd = 0;

    switch (recurUnit) {
      case 'minute': minutesToAdd = recurInterval; break;
      case 'hour': minutesToAdd = recurInterval * calendarSettings.minutesPerHour; break;
      case 'day': minutesToAdd = recurInterval * calendarSettings.hoursPerDay * calendarSettings.minutesPerHour; break;
      case 'week': minutesToAdd = recurInterval * 7 * calendarSettings.hoursPerDay * calendarSettings.minutesPerHour; break;
      case 'year': minutesToAdd = recurInterval * calendarSettings.daysPerYear * calendarSettings.hoursPerDay * calendarSettings.minutesPerHour; break;
    }

    const currentTotal = calculateTotalMinutes(event.targetTime);
    const newTotal = currentTotal + minutesToAdd;
    const newTargetTime = minutesToTime(newTotal);

    return { ...event, targetTime: newTargetTime };
  };

  // Quick skip presets
  const quickSkips = [
    { label: '10 min', minutes: 10, icon: '⏱️' },
    { label: '30 min', minutes: 30, icon: '⏱️' },
    { label: '1 hour', minutes: 60, icon: '🕐' },
    { label: '2 hours', minutes: 120, icon: '🕐' },
    { label: '4 hours', minutes: 240, icon: '🕐' },
    { label: '8 hours (Rest)', minutes: 480, icon: '😴' },
    { label: '12 hours', minutes: 720, icon: '🌓' },
    { label: '1 day', minutes: 1440, icon: '📅' },
    { label: '3 days', minutes: 4320, icon: '📅' },
    { label: '1 week', minutes: 10080, icon: '📆' },
    { label: '1 month', minutes: 43200, icon: '📆' },
    { label: '1 year', minutes: 525600, icon: '🗓️' }
  ];

  // Event types
  const eventTypes = [
    { id: 'deadline', name: 'Deadline', icon: '⏰', color: 'red' },
    { id: 'meeting', name: 'Meeting', icon: '👥', color: 'blue' },
    { id: 'event', name: 'Event', icon: '📅', color: 'green' },
    { id: 'reminder', name: 'Reminder', icon: '🔔', color: 'yellow' },
    { id: 'quest', name: 'Quest Timer', icon: '⚔️', color: 'purple' },
    { id: 'environmental', name: 'Environmental', icon: '🌍', color: 'teal' }
  ];

  // Get day of week
  const getDayOfWeek = () => {
    if (!calendarSettings.useEarthCalendar) return null;
    const dayIndex = gameTime.day % calendarSettings.dayNames.length;
    return calendarSettings.dayNames[dayIndex];
  };

  // Get month and day
  const getMonthAndDay = () => {
    if (!calendarSettings.useEarthCalendar) return null;

    let remainingDays = gameTime.day;
    let monthIndex = 0;

    while (remainingDays > calendarSettings.daysPerMonth[monthIndex]) {
      remainingDays -= calendarSettings.daysPerMonth[monthIndex];
      monthIndex++;
      if (monthIndex >= calendarSettings.daysPerMonth.length) {
        monthIndex = 0;
      }
    }

    return {
      month: calendarSettings.monthNames[monthIndex],
      day: remainingDays
    };
  };

  // Get time of day
  const getTimeOfDay = () => {
    const hour = gameTime.hour;
    if (hour >= 5 && hour < 12) return { label: 'Morning', icon: '🌅', color: 'text-yellow-400' };
    if (hour >= 12 && hour < 17) return { label: 'Afternoon', icon: '☀️', color: 'text-orange-400' };
    if (hour >= 17 && hour < 21) return { label: 'Evening', icon: '🌆', color: 'text-orange-600' };
    return { label: 'Night', icon: '🌙', color: 'text-blue-400' };
  };

  // Format duration
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  // Format game time
  const formatGameTime = (time = gameTime) => {
    const { year, day, hour, minute } = time;
    const paddedHour = String(hour).padStart(2, '0');
    const paddedMinute = String(minute).padStart(2, '0');

    if (calendarSettings.useEarthCalendar) {
      const monthDay = getMonthAndDay();
      return `${monthDay.month} ${monthDay.day}, ${year} - ${paddedHour}:${paddedMinute}`;
    }

    return `Year ${year}, Day ${day} - ${paddedHour}:${paddedMinute}`;
  };

  // Open event modal
  const openEventModal = (event = null, index = null) => {
    if (event) {
      setEditingEvent(index);
      setEventForm({ ...event });
    } else {
      setEditingEvent(null);
      setEventForm({
        name: '',
        description: '',
        targetTime: { ...gameTime },
        type: 'deadline',
        recurring: false,
        recurInterval: 1,
        recurUnit: 'day',
        alertBefore: 0,
        completed: false,
        color: 'blue'
      });
    }
    setShowEventModal(true);
  };

  // Save event
  const saveEvent = () => {
    if (!eventForm.name.trim()) {
      alert('Event name is required');
      return;
    }

    const totalMins = calculateTotalMinutes(eventForm.targetTime);
    const newEvent = {
      ...eventForm,
      targetTime: { ...eventForm.targetTime, totalMinutes: totalMins }
    };

    let newEvents;
    if (editingEvent !== null) {
      newEvents = [...timeEvents];
      newEvents[editingEvent] = newEvent;
    } else {
      newEvents = [...timeEvents, newEvent];
    }

    setTimeEvents(newEvents);
    setShowEventModal(false);
  };

  // Delete event
  const deleteEvent = (index) => {
    if (confirm('Delete this time event?')) {
      const newEvents = timeEvents.filter((_, i) => i !== index);
      setTimeEvents(newEvents);
    }
  };

  // Toggle event completion
  const toggleEventComplete = (index) => {
    const newEvents = [...timeEvents];
    newEvents[index].completed = !newEvents[index].completed;
    setTimeEvents(newEvents);
  };

  // Get upcoming events
  const upcomingEvents = timeEvents
    .filter(e => !e.completed && calculateTotalMinutes(e.targetTime) > gameTime.totalMinutes)
    .sort((a, b) => calculateTotalMinutes(a.targetTime) - calculateTotalMinutes(b.targetTime))
    .slice(0, 5);

  // Get event type info
  const getEventType = (typeId) => {
    return eventTypes.find(t => t.id === typeId) || eventTypes[0];
  };

  // Time until event
  const timeUntilEvent = (event) => {
    const diff = calculateTotalMinutes(event.targetTime) - gameTime.totalMinutes;
    if (diff < 0) return 'Overdue';

    const days = Math.floor(diff / (calendarSettings.hoursPerDay * calendarSettings.minutesPerHour));
    const hours = Math.floor((diff % (calendarSettings.hoursPerDay * calendarSettings.minutesPerHour)) / calendarSettings.minutesPerHour);
    const minutes = diff % calendarSettings.minutesPerHour;

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const timeOfDay = getTimeOfDay();
  const monthDay = getMonthAndDay();
  const dayOfWeek = getDayOfWeek();

  return (
    <div className="space-y-6">
      {/* Event Modal */}
      {showEventModal && !readOnly && (
        <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="bg-gray-800 rounded-xl border border-gray-600 w-full max-w-3xl mx-auto">
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  {editingEvent !== null ? '✏️ Edit Time Event' : '⏰ New Time Event'}
                </h3>
                <button onClick={() => setShowEventModal(false)} className="text-gray-400 hover:text-white p-2">✕</button>
              </div>

              <div className="p-6 space-y-4">
                {/* Event Name */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Event Name *</label>
                  <input
                    type="text"
                    value={eventForm.name}
                    onChange={(e) => setEventForm({...eventForm, name: e.target.value})}
                    placeholder="e.g., Supply Ship Arrival"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                    placeholder="Additional details..."
                    rows="3"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Event Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {eventTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => setEventForm({...eventForm, type: type.id})}
                        className={`p-3 rounded-lg border transition-all ${
                          eventForm.type === type.id
                            ? 'bg-indigo-600 border-indigo-400 text-white'
                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <div className="text-xl mb-1">{type.icon}</div>
                        <div className="text-sm">{type.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Time */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Target Date/Time</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Year</label>
                      <input
                        type="number"
                        value={eventForm.targetTime.year}
                        onChange={(e) => setEventForm({...eventForm, targetTime: {...eventForm.targetTime, year: parseInt(e.target.value) || 0}})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Day</label>
                      <input
                        type="number"
                        value={eventForm.targetTime.day}
                        onChange={(e) => setEventForm({...eventForm, targetTime: {...eventForm.targetTime, day: parseInt(e.target.value) || 0}})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Hour</label>
                      <input
                        type="number"
                        value={eventForm.targetTime.hour}
                        onChange={(e) => setEventForm({...eventForm, targetTime: {...eventForm.targetTime, hour: parseInt(e.target.value) || 0}})}
                        min="0"
                        max="23"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Minute</label>
                      <input
                        type="number"
                        value={eventForm.targetTime.minute}
                        onChange={(e) => setEventForm({...eventForm, targetTime: {...eventForm.targetTime, minute: parseInt(e.target.value) || 0}})}
                        min="0"
                        max="59"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Alert Before */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">Alert Before (minutes)</label>
                  <input
                    type="number"
                    value={eventForm.alertBefore}
                    onChange={(e) => setEventForm({...eventForm, alertBefore: parseInt(e.target.value) || 0})}
                    placeholder="0 = No alert"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Recurring */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={eventForm.recurring}
                      onChange={(e) => setEventForm({...eventForm, recurring: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300 text-sm">🔁 Recurring Event</span>
                  </label>
                </div>

                {eventForm.recurring && (
                  <div className="grid grid-cols-2 gap-3 pl-6">
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Repeat Every</label>
                      <input
                        type="number"
                        value={eventForm.recurInterval}
                        onChange={(e) => setEventForm({...eventForm, recurInterval: parseInt(e.target.value) || 1})}
                        min="1"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Unit</label>
                      <select
                        value={eventForm.recurUnit}
                        onChange={(e) => setEventForm({...eventForm, recurUnit: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="minute">Minute(s)</option>
                        <option value="hour">Hour(s)</option>
                        <option value="day">Day(s)</option>
                        <option value="week">Week(s)</option>
                        <option value="year">Year(s)</option>
                      </select>
                    </div>
                  </div>
                )}

                <button
                  onClick={saveEvent}
                  className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                  {editingEvent !== null ? '💾 Save Changes' : '⏰ Create Event'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Log Modal */}
      {showLog && (
        <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="bg-gray-800 rounded-xl border border-gray-600 w-full max-w-4xl mx-auto">
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">📜 Time Change Log</h3>
                <button onClick={() => setShowLog(false)} className="text-gray-400 hover:text-white p-2">✕</button>
              </div>

              <div className="p-6 max-h-96 overflow-y-auto">
                {timeLog.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No time changes logged yet</p>
                ) : (
                  <div className="space-y-2">
                    {timeLog.map((entry, idx) => (
                      <div key={idx} className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-white font-medium">{entry.reason}</div>
                            <div className="text-gray-400 text-sm">
                              {formatGameTime(entry.gameTime)} 
                              {entry.minutesChanged !== 0 && (
                                <span className={entry.minutesChanged > 0 ? 'text-green-400' : 'text-red-400'}>
                                  {' '}({entry.minutesChanged > 0 ? '+' : ''}{entry.minutesChanged} min)
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-gray-500 text-xs">
                            {new Date(entry.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">🕐 Time Tracker</h2>
          <p className="text-gray-400">Manage in-game time and scheduled events</p>
        </div>
        {!readOnly && (
          <button
            onClick={toggleSession}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              isPaused
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
            }`}
          >
            {isPaused ? '▶️ Start Session' : '⏸️ Pause Session'}
          </button>
        )}
      </div>

      {/* Main Time Display */}
      <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl p-8 border border-indigo-500/30">
        <div className="text-center space-y-4">
          <div className={`text-6xl ${timeOfDay.color}`}>{timeOfDay.icon}</div>
          <div className="text-white text-5xl font-bold">{String(gameTime.hour).padStart(2, '0')}:{String(gameTime.minute).padStart(2, '0')}</div>
          <div className="text-gray-300 text-2xl">{timeOfDay.label}</div>

          {calendarSettings.useEarthCalendar && monthDay && (
            <>
              <div className="text-indigo-300 text-xl">{dayOfWeek}</div>
              <div className="text-gray-400 text-lg">{monthDay.month} {monthDay.day}, {gameTime.year}</div>
            </>
          )}

          {!calendarSettings.useEarthCalendar && (
            <div className="text-gray-400 text-lg">Year {gameTime.year}, Day {gameTime.day}</div>
          )}
        </div>

        {/* Quick Controls */}
        {!readOnly && (
          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => advanceTime(-60, 'Rewind 1 hour')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              ⏪ -1h
            </button>
            <button
              onClick={() => advanceTime(-10, 'Rewind 10 min')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              ◀️ -10m
            </button>
            <button
              onClick={() => setShowQuickSkip(!showQuickSkip)}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
            >
              ⏩ Quick Skip
            </button>
            <button
              onClick={() => advanceTime(10, 'Advance 10 min')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              ▶️ +10m
            </button>
            <button
              onClick={() => advanceTime(60, 'Advance 1 hour')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              ⏩ +1h
            </button>
            <button
              onClick={() => {
                setManualForm({ ...gameTime });
                setShowManualEdit(!showManualEdit);
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              ✏️ Manual Edit
            </button>
          </div>
        )}

        {/* Quick Skip Panel */}
        {showQuickSkip && !readOnly && (
          <div className="mt-4 p-4 bg-black/30 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-3 text-center">Select Time Skip</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {quickSkips.map((skip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    advanceTime(skip.minutes, `Skip: ${skip.label}`);
                    setShowQuickSkip(false);
                  }}
                  className="p-3 bg-gradient-to-br from-indigo-700 to-purple-700 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg transition-all text-center"
                >
                  <div className="text-2xl mb-1">{skip.icon}</div>
                  <div className="text-sm font-medium">{skip.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Manual Edit Panel */}
        {showManualEdit && !readOnly && (
          <div className="mt-4 p-4 bg-black/30 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-3">Set Exact Time</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div>
                <label className="block text-gray-400 text-xs mb-1">Year</label>
                <input
                  type="number"
                  value={manualForm.year}
                  onChange={(e) => setManualForm({...manualForm, year: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">Day</label>
                <input
                  type="number"
                  value={manualForm.day}
                  onChange={(e) => setManualForm({...manualForm, day: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">Hour (0-23)</label>
                <input
                  type="number"
                  value={manualForm.hour}
                  onChange={(e) => setManualForm({...manualForm, hour: parseInt(e.target.value) || 0})}
                  min="0"
                  max="23"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">Minute (0-59)</label>
                <input
                  type="number"
                  value={manualForm.minute}
                  onChange={(e) => setManualForm({...manualForm, minute: parseInt(e.target.value) || 0})}
                  min="0"
                  max="59"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setAbsoluteTime(manualForm);
                  setShowManualEdit(false);
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                ✓ Set Time
              </button>
              <button
                onClick={() => setShowManualEdit(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Session Info */}
      {sessionStart && (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-gray-400 text-sm">Session Started</div>
              <div className="text-white text-lg font-medium">
                {new Date(sessionStart).toLocaleTimeString()}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Real-World Duration</div>
              <div className="text-white text-lg font-medium">
                {formatDuration(sessionDuration)}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Status</div>
              <div className={`text-lg font-medium ${isPaused ? 'text-yellow-400' : 'text-green-400'}`}>
                {isPaused ? '⏸️ Paused' : '▶️ Active'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Advance Settings */}
      {!readOnly && (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-medium">⚡ Auto-Advance Time</h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoAdvance}
                onChange={(e) => setAutoAdvance(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-gray-300 text-sm">Enable</span>
            </label>
          </div>
          {autoAdvance && (
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Speed: {advanceSpeed} minute{advanceSpeed !== 1 ? 's' : ''} per real second
              </label>
              <input
                type="range"
                min="1"
                max="60"
                value={advanceSpeed}
                onChange={(e) => setAdvanceSpeed(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Slow (1m/s)</span>
                <span>Fast (60m/s = 1h/s)</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upcoming Events */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">📅 Upcoming Events</h3>
          {!readOnly && (
            <button
              onClick={() => openEventModal()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              + New Event
            </button>
          )}
        </div>

        {upcomingEvents.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No upcoming events scheduled</p>
        ) : (
          <div className="space-y-2">
            {upcomingEvents.map((event, idx) => {
              const actualIndex = timeEvents.indexOf(event);
              const eventType = getEventType(event.type);
              return (
                <div key={actualIndex} className="p-3 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-lg border border-indigo-500/20">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-2xl">{eventType.icon}</div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{event.name}</div>
                        {event.description && <div className="text-gray-400 text-sm">{event.description}</div>}
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>📅 {formatGameTime(event.targetTime)}</span>
                          <span className="text-indigo-400 font-medium">In {timeUntilEvent(event)}</span>
                          {event.recurring && <span>🔁 Recurring</span>}
                        </div>
                      </div>
                    </div>
                    {!readOnly && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEventModal(event, actualIndex)}
                          className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/20 rounded transition-colors"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => toggleEventComplete(actualIndex)}
                          className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-900/20 rounded transition-colors"
                          title="Mark Complete"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => deleteEvent(actualIndex)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {timeEvents.filter(e => e.completed).length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-gray-400 text-sm mb-2">
              {timeEvents.filter(e => e.completed).length} completed event(s)
            </div>
          </div>
        )}
      </div>

      {/* Time Log Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowLog(true)}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <span>📜</span>
          <span>View Time Change Log</span>
          <span className="px-2 py-0.5 bg-gray-600 rounded text-xs">{timeLog.length}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-gray-400 text-sm">Total Events</div>
            <div className="text-white text-2xl font-bold">{timeEvents.length}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Upcoming</div>
            <div className="text-white text-2xl font-bold">{upcomingEvents.length}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Completed</div>
            <div className="text-white text-2xl font-bold">{timeEvents.filter(e => e.completed).length}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Time Changes</div>
            <div className="text-white text-2xl font-bold">{timeLog.length}</div>
          </div>
        </div>
      </div>

      {/* Help Box */}
      <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4">
        <h4 className="text-indigo-300 font-medium mb-2">💡 Time Tracker Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-indigo-400 text-sm">
          <div>• <strong>Quick Skip:</strong> Jump forward common durations</div>
          <div>• <strong>Manual Edit:</strong> Set exact date/time</div>
          <div>• <strong>Auto-Advance:</strong> Real-time progression</div>
          <div>• <strong>Time Events:</strong> Schedule reminders & deadlines</div>
          <div>• <strong>Recurring Events:</strong> Repeating schedules</div>
          <div>• <strong>Alerts:</strong> Get notified before events</div>
          <div>• <strong>Time Log:</strong> Track all time changes</div>
          <div>• <strong>Session Timer:</strong> Real-world duration tracking</div>
          <div>• <strong>Day/Night Cycle:</strong> Automatic time-of-day</div>
          <div>• <strong>Parent Notification:</strong> Triggers site-wide time events</div>
        </div>
      </div>

      {readOnly && (
        <p className="text-gray-500 text-sm text-center">👁️ Read-only view</p>
      )}
    </div>
  );
}
