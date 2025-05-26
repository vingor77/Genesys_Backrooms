import React, { useState } from 'react';
import { Accordion,AccordionDetails,AccordionSummary,Box,Card,CardContent,Chip,Container,Divider,Grid,Paper,Stack,Tab,Tabs,Typography,useTheme,alpha } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const NotLoggedIn = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
    <Typography variant="h5" color="text.secondary">Please log in to access game information</Typography>
  </Box>
);

export default function Information() {
  const theme = useTheme();
  const [generalValue, setGeneralValue] = useState(0);
  const [effectValue, setEffectValue] = useState(0);
  const [lethalValue, setLethalValue] = useState(0);
  const [isLoggedIn] = useState(true);

  const DisplayGeneralTab = () => {
    const content = [
      // Actions per turn
    <Box key="actions" maxHeight="750px" overflow="auto" sx={{ p: 2 }}>
      {/* Header Section */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Turn Structure
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          What you can do each turn in combat and encounters
        </Typography>
      </Paper>
      
      {/* Action Categories */}
      <Stack spacing={3}>
        {/* Actions Section */}
        <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ 
            background: 'linear-gradient(90deg, #4CAF50 0%, #45a049 100%)',
            p: 2,
            color: 'white'
          }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="h5" fontWeight="bold">1</Typography>
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  One Action Per Turn
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Choose one primary action
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ p: 3, bgcolor: alpha('#4CAF50', 0.05) }}>
            <Grid container spacing={2}>
              {[
                { icon: '⚔️', title: 'Use a maneuver', desc: 'Perform tactical movement' },
                { icon: '⚡', title: 'Activate an ability', desc: 'Use special powers or talents' },
                { icon: '🎯', title: 'Perform a skill check', desc: 'Use your expertise' },
                { icon: '🗡️', title: 'Perform a combat check', desc: 'Attack or defend' }
              ].map((action, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper elevation={1} sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    border: '2px solid transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      border: '2px solid #4CAF50',
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography variant="h4">{action.icon}</Typography>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {action.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {action.desc}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
            
        {/* Maneuvers Section */}
        <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ 
            background: 'linear-gradient(90deg, #2196F3 0%, #1976D2 100%)',
            p: 2,
            color: 'white'
          }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="h5" fontWeight="bold">2</Typography>
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Two Maneuvers Per Turn
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Tactical options and positioning (Page 98-100)
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ p: 3, bgcolor: alpha('#2196F3', 0.05) }}>
            <Grid container spacing={1.5}>
              {[
                { icon: '🎯', name: 'Aim' },
                { icon: '🤝', name: 'Assist' },
                { icon: '🛡️', name: 'Guarded Stance' },
                { icon: '🔧', name: 'Interact with Environment' },
                { icon: '🎒', name: 'Manage Gear' },
                { icon: '🐎', name: 'Mount or Dismount' },
                { icon: '🏃', name: 'Move' },
                { icon: '🤲', name: 'Drop prone or Stand from prone' },
                { icon: '⏳', name: 'Preparation' },
                { icon: '✨', name: 'Other non-check actions' }
              ].map((maneuver, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Chip
                    icon={<Typography>{maneuver.icon}</Typography>}
                    label={maneuver.name}
                    variant="outlined"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      py: 1,
                      px: 1,
                      '& .MuiChip-label': {
                        fontSize: '0.8rem',
                        textAlign: 'center',
                        whiteSpace: 'normal',
                        lineHeight: 1.2
                      },
                      borderColor: '#2196F3',
                      color: '#2196F3',
                      '&:hover': {
                        bgcolor: alpha('#2196F3', 0.1),
                        borderColor: '#1976D2'
                      }
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
            
        {/* Incidentals Section */}
        <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ 
            background: 'linear-gradient(90deg, #FF9800 0%, #F57C00 100%)',
            p: 2,
            color: 'white'
          }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="h5" fontWeight="bold">3</Typography>
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Three Incidentals Per Turn
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Quick, minor actions that don't require much effort
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ p: 3, bgcolor: alpha('#FF9800', 0.05) }}>
            <Stack spacing={2}>
              {[
                { icon: '💬', text: 'Speak to another character', type: 'Communication' },
                { icon: '📦', text: 'Drop a held item or object', type: 'Item Management' },
                { icon: '👀', text: 'Minor movements like looking behind you or peeking around a corner', type: 'Awareness' },
                { icon: '⚡', text: 'Another action that takes very little time or has no measurable impact', type: 'Miscellaneous' }
              ].map((incidental, index) => (
                <Paper key={index} elevation={1} sx={{ 
                  p: 2, 
                  borderLeft: '4px solid #FF9800',
                  bgcolor: 'white',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: alpha('#FF9800', 0.02),
                    transform: 'translateX(4px)'
                  }
                }}>
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <Typography variant="h5" sx={{ mt: 0.5 }}>{incidental.icon}</Typography>
                    <Box>
                      <Chip 
                        label={incidental.type} 
                        size="small" 
                        sx={{ 
                          bgcolor: alpha('#FF9800', 0.1), 
                          color: '#F57C00',
                          mb: 0.5,
                          fontSize: '0.7rem'
                        }} 
                      />
                      <Typography variant="body2">{incidental.text}</Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Stack>
            
            {/* Special Rule */}
            <Paper elevation={2} sx={{ 
              mt: 3, 
              p: 2, 
              bgcolor: alpha('#FF5722', 0.1),
              border: '2px dashed #FF5722',
              borderRadius: 2
            }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h5">⚠️</Typography>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" color="#FF5722">
                    Outside Your Turn
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You may perform <strong>1 incidental</strong> from the above list during other players' turns
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Paper>
      </Stack>
    </Box>,

    <Box key="stats" maxHeight="750px" overflow="auto" sx={{ p: 1 }}>
      {/* Header Section */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 2,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Character Maximums
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Ultimate limits for your character
        </Typography>
      </Paper>
      
      <Stack spacing={2}>
        {/* Combat Stats - Simple List Format */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#f44336', 0.1), 
            p: 2, 
            borderBottom: '3px solid #f44336'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#f44336' }}>
              🛡️ Combat & Survival Stats
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {[
                { icon: '🛡️', label: 'Defense', value: '4', desc: 'Maximum defensive rating' },
                { icon: '💪', label: 'Soak', value: '10', desc: 'Damage reduction capacity' },
                { icon: '❤️', label: 'Wounds', value: '150', desc: 'Physical health threshold' },
                { icon: '🧠', label: 'Strain', value: '150', desc: 'Mental fatigue threshold' }
              ].map((stat, index) => (
                <Paper 
                  key={index}
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: alpha('#f44336', 0.03),
                    border: '1px solid',
                    borderColor: alpha('#f44336', 0.2)
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography variant="h5">{stat.icon}</Typography>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#f44336' }}>
                          {stat.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                          {stat.desc}
                        </Typography>
                      </Box>
                    </Box>
                    <Box 
                      sx={{ 
                        minWidth: 48, 
                        height: 48, 
                        borderRadius: '50%', 
                        bgcolor: '#f44336',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold" color="white">
                        {stat.value}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Paper>
            
        {/* Character Progression - Simple Cards */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#2196F3', 0.1), 
            p: 2, 
            borderBottom: '3px solid #2196F3'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#2196F3' }}>
              📈 Character Development Limits
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {/* Characteristics */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: alpha('#2196F3', 0.03),
                  border: '1px solid',
                  borderColor: alpha('#2196F3', 0.2)
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h5">📊</Typography>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#2196F3' }}>
                        Characteristics
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                        Core attributes (Brawn, Agility, etc.)
                      </Typography>
                    </Box>
                  </Box>
                  <Box 
                    sx={{ 
                      minWidth: 48, 
                      height: 48, 
                      borderRadius: '50%', 
                      bgcolor: '#2196F3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="white">
                      6
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 1, pl: 5 }}>
                  <Chip 
                    label="Max 5 during character creation" 
                    size="small" 
                    sx={{
                      bgcolor: alpha('#2196F3', 0.1),
                      color: '#2196F3',
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>
              </Paper>
                  
              {/* Skills */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: alpha('#2196F3', 0.03),
                  border: '1px solid',
                  borderColor: alpha('#2196F3', 0.2)
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h5">🎯</Typography>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#2196F3' }}>
                        Skills
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                        Individual skill rank maximum
                      </Typography>
                    </Box>
                  </Box>
                  <Box 
                    sx={{ 
                      minWidth: 48, 
                      height: 48, 
                      borderRadius: '50%', 
                      bgcolor: '#2196F3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="white">
                      6
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 1, pl: 5 }}>
                  <Chip 
                    label="Max 2 during character creation" 
                    size="small" 
                    sx={{
                      bgcolor: alpha('#2196F3', 0.1),
                      color: '#2196F3',
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>
              </Paper>
                  
              {/* Quick Reference */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: alpha('#4CAF50', 0.05),
                  border: '1px dashed #4CAF50',
                  borderRadius: 2
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="h5">💡</Typography>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                      Quick Reference
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                      These are the absolute maximum values your character can achieve
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Stack>
          </Box>
        </Paper>
      </Stack>
    </Box>,

    <Box key="rolls" maxHeight="750px" overflow="auto" sx={{ p: 1 }}>
      {/* Header Section */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 2,
          background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
          🎲 Dice System & Spending Results
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Maximum dice limits and how to spend your roll results
        </Typography>

        {/* Dice Limits */}
        <Stack spacing={1}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4CAF50' }} />
            <Typography variant="body2" fontWeight="medium">5 boost dice</Typography>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f44336' }} />
            <Typography variant="body2" fontWeight="medium">5 setback dice</Typography>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#9c27b0' }} />
            <Typography variant="body2" fontWeight="medium">2 difficulty dice</Typography>
          </Box>
        </Stack>
      </Paper>
      
      <Stack spacing={2}>
        {/* Advantages in Combat */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#4CAF50', 0.1), 
            p: 2, 
            borderBottom: '3px solid #4CAF50'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#4CAF50' }}>
              ✅ Spending Advantages in Combat
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {[
                {
                  cost: '1',
                  options: [
                    'Recover strain',
                    'Add a boost dice to the next ally\'s check',
                    'Notice an important detail'
                  ]
                },
                {
                  cost: '2',
                  options: [
                    'Perform a free maneuver',
                    'Add a setback dice to a target\'s next check'
                  ]
                },
                {
                  cost: '3',
                  options: [
                    'Remove 1 melee or ranged defense from target until end of turn',
                    'Ignore environmental penalties',
                    'Forgo damage to force the target to skip their next turn',
                    'Gain 1 melee or ranged defense until the start of your next turn',
                    'Disarm the target'
                  ]
                }
              ].map((advantage, index) => (
                <Paper 
                  key={index}
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: alpha('#4CAF50', 0.03),
                    border: '1px solid',
                    borderColor: alpha('#4CAF50', 0.2)
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Chip 
                      label={advantage.cost} 
                      sx={{ 
                        bgcolor: '#4CAF50', 
                        color: 'white', 
                        fontWeight: 'bold',
                        minWidth: 32,
                        height: 32
                      }} 
                    />
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                      Advantage{advantage.cost !== '1' ? 's' : ''} Required
                    </Typography>
                  </Box>
                  <Stack spacing={0.5} sx={{ pl: 2 }}>
                    {advantage.options.map((option, optIndex) => (
                      <Typography key={optIndex} variant="body2" sx={{ fontSize: '0.85rem' }}>
                        • {option}
                      </Typography>
                    ))}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Paper>
            
        {/* Advantages in Social Conflict */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#2196F3', 0.1), 
            p: 2, 
            borderBottom: '3px solid #2196F3'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#2196F3' }}>
              💬 Spending Advantages in Social Conflict
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {[
                {
                  cost: '1',
                  options: [
                    'Recover strain',
                    'Add a boost dice to the next ally\'s check',
                    'Notice an important detail'
                  ]
                },
                {
                  cost: '2',
                  options: [
                    'Perform a free maneuver',
                    'Add a setback dice to a target\'s next check',
                    'Learn the strength or flaw of the target'
                  ]
                },
                {
                  cost: '3',
                  options: [
                    'Learn the desire or fear of the target',
                    'Conceal your true goal',
                    'Learn the target\'s true goal'
                  ]
                },
                {
                  cost: '4',
                  options: [
                    'Inflict a critical remark'
                  ]
                }
              ].map((advantage, index) => (
                <Paper 
                  key={index}
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: alpha('#2196F3', 0.03),
                    border: '1px solid',
                    borderColor: alpha('#2196F3', 0.2)
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Chip 
                      label={advantage.cost} 
                      sx={{ 
                        bgcolor: '#2196F3', 
                        color: 'white', 
                        fontWeight: 'bold',
                        minWidth: 32,
                        height: 32
                      }} 
                    />
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#2196F3' }}>
                      Advantage{advantage.cost !== '1' ? 's' : ''} Required
                    </Typography>
                  </Box>
                  <Stack spacing={0.5} sx={{ pl: 2 }}>
                    {advantage.options.map((option, optIndex) => (
                      <Typography key={optIndex} variant="body2" sx={{ fontSize: '0.85rem' }}>
                        • {option}
                      </Typography>
                    ))}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Paper>
            
        {/* Triumphs in Combat */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#FF9800', 0.1), 
            p: 2, 
            borderBottom: '3px solid #FF9800'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#FF9800' }}>
              ⚡ Spending Triumphs in Combat
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {[
                {
                  cost: '1',
                  options: [
                    'Anything requiring advantages',
                    'Add 1 difficulty to target\'s next check',
                    'Upgrade an ally\'s next check',
                    'Do something vital',
                    'On initiative, perform a free maneuver',
                    'Inflict a critical injury',
                    'Damage the target\'s armor or weapon'
                  ]
                },
                {
                  cost: '2',
                  options: [
                    'Destroy the target\'s weapon (if possible)'
                  ]
                }
              ].map((triumph, index) => (
                <Paper 
                  key={index}
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: alpha('#FF9800', 0.03),
                    border: '1px solid',
                    borderColor: alpha('#FF9800', 0.2)
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Chip 
                      label={triumph.cost} 
                      sx={{ 
                        bgcolor: '#FF9800', 
                        color: 'white', 
                        fontWeight: 'bold',
                        minWidth: 32,
                        height: 32
                      }} 
                    />
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#FF9800' }}>
                      Triumph{triumph.cost !== '1' ? 's' : ''} Required
                    </Typography>
                  </Box>
                  <Stack spacing={0.5} sx={{ pl: 2 }}>
                    {triumph.options.map((option, optIndex) => (
                      <Typography key={optIndex} variant="body2" sx={{ fontSize: '0.85rem' }}>
                        • {option}
                      </Typography>
                    ))}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Paper>
            
        {/* Triumphs in Social Conflict */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#9C27B0', 0.1), 
            p: 2, 
            borderBottom: '3px solid #9C27B0'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#9C27B0' }}>
              💫 Spending Triumphs in Social Conflict
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                borderRadius: 2,
                bgcolor: alpha('#9C27B0', 0.03),
                border: '1px solid',
                borderColor: alpha('#9C27B0', 0.2)
              }}
            >
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Chip 
                  label="1" 
                  sx={{ 
                    bgcolor: '#9C27B0', 
                    color: 'white', 
                    fontWeight: 'bold',
                    minWidth: 32,
                    height: 32
                  }} 
                />
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#9C27B0' }}>
                  Triumph Required
                </Typography>
              </Box>
              <Stack spacing={0.5} sx={{ pl: 2 }}>
                {[
                  'Anything requiring advantages',
                  'Add 1 difficulty to target\'s next check',
                  'Upgrade an ally\'s next check',
                  'Do something vital',
                  'On initiative, perform a free maneuver',
                  'Inflict a critical remark'
                ].map((option, index) => (
                  <Typography key={index} variant="body2" sx={{ fontSize: '0.85rem' }}>
                    • {option}
                  </Typography>
                ))}
              </Stack>
            </Paper>
          </Box>
        </Paper>
              
        {/* Threat in Combat */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#f44336', 0.1), 
            p: 2, 
            borderBottom: '3px solid #f44336'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#f44336' }}>
              ❌ Spending Threat in Combat
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {[
                {
                  cost: '1',
                  options: [
                    'Suffer 1 strain',
                    'Lose the benefits of a previous maneuver'
                  ]
                },
                {
                  cost: '2',
                  options: [
                    'Target may perform a maneuver free',
                    'Add a boost dice to the target\'s next check',
                    'The active player adds a setback dice to the next check made'
                  ]
                },
                {
                  cost: '3',
                  options: [
                    'Fall prone'
                  ]
                }
              ].map((threat, index) => (
                <Paper 
                  key={index}
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: alpha('#f44336', 0.03),
                    border: '1px solid',
                    borderColor: alpha('#f44336', 0.2)
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Chip 
                      label={threat.cost} 
                      sx={{ 
                        bgcolor: '#f44336', 
                        color: 'white', 
                        fontWeight: 'bold',
                        minWidth: 32,
                        height: 32
                      }} 
                    />
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#f44336' }}>
                      Threat{threat.cost !== '1' ? 's' : ''} Required
                    </Typography>
                  </Box>
                  <Stack spacing={0.5} sx={{ pl: 2 }}>
                    {threat.options.map((option, optIndex) => (
                      <Typography key={optIndex} variant="body2" sx={{ fontSize: '0.85rem' }}>
                        • {option}
                      </Typography>
                    ))}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Paper>
            
        {/* Threat in Social Conflict */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#e91e63', 0.1), 
            p: 2, 
            borderBottom: '3px solid #e91e63'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#e91e63' }}>
              🗣️ Spending Threat in Social Conflict
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {[
                {
                  cost: '1',
                  options: [
                    'Suffer 1 strain'
                  ]
                },
                {
                  cost: '2',
                  options: [
                    'Add a boost dice to the target\'s next check',
                    'The active player adds a setback dice to the next check made',
                    'The active player reveals their own strength or flaw'
                  ]
                },
                {
                  cost: '3',
                  options: [
                    'The active player reveals their own desire or fear',
                    'The active character reveals their own true goal'
                  ]
                }
              ].map((threat, index) => (
                <Paper 
                  key={index}
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: alpha('#e91e63', 0.03),
                    border: '1px solid',
                    borderColor: alpha('#e91e63', 0.2)
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Chip 
                      label={threat.cost} 
                      sx={{ 
                        bgcolor: '#e91e63', 
                        color: 'white', 
                        fontWeight: 'bold',
                        minWidth: 32,
                        height: 32
                      }} 
                    />
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#e91e63' }}>
                      Threat{threat.cost !== '1' ? 's' : ''} Required
                    </Typography>
                  </Box>
                  <Stack spacing={0.5} sx={{ pl: 2 }}>
                    {threat.options.map((option, optIndex) => (
                      <Typography key={optIndex} variant="body2" sx={{ fontSize: '0.85rem' }}>
                        • {option}
                      </Typography>
                    ))}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Paper>
            
        {/* Despair in Combat & Social */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#9c27b0', 0.1), 
            p: 2, 
            borderBottom: '3px solid #9c27b0'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#9c27b0' }}>
              💀 Spending Despair
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {/* Combat Despair */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: alpha('#9c27b0', 0.03),
                  border: '1px solid',
                  borderColor: alpha('#9c27b0', 0.2)
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <Chip 
                    label="1" 
                    sx={{ 
                      bgcolor: '#9c27b0', 
                      color: 'white', 
                      fontWeight: 'bold',
                      minWidth: 32,
                      height: 32
                    }} 
                  />
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#9c27b0' }}>
                    Despair in Combat
                  </Typography>
                </Box>
                <Stack spacing={0.5} sx={{ pl: 2 }}>
                  {[
                    'Anything requiring threats',
                    'The active player\'s next check is 1 difficulty higher',
                    'Damage the active player\'s weapon. If dual-wielding, damage the first weapon',
                    'Damage the active player\'s armor'
                  ].map((option, index) => (
                    <Typography key={index} variant="body2" sx={{ fontSize: '0.85rem' }}>
                      • {option}
                    </Typography>
                  ))}
                </Stack>
              </Paper>
                
              {/* Social Despair */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: alpha('#607d8b', 0.03),
                  border: '1px solid',
                  borderColor: alpha('#607d8b', 0.2)
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <Chip 
                    label="1" 
                    sx={{ 
                      bgcolor: '#607d8b', 
                      color: 'white', 
                      fontWeight: 'bold',
                      minWidth: 32,
                      height: 32
                    }} 
                  />
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#607d8b' }}>
                    Despair in Social Conflict
                  </Typography>
                </Box>
                <Stack spacing={0.5} sx={{ pl: 2 }}>
                  {[
                    'Anything requiring threats',
                    'The active player\'s next check is 1 difficulty higher',
                    'The active player becomes distracted and loses their next turn',
                    'Learn a false motivation facet of target'
                  ].map((option, index) => (
                    <Typography key={index} variant="body2" sx={{ fontSize: '0.85rem' }}>
                      • {option}
                    </Typography>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Box>
        </Paper>
      </Stack>
    </Box>,

    <Box key="keywords" maxHeight="750px" overflow="auto" sx={{ p: 1 }}>
      {/* Header Section */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 2,
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          borderRadius: 2,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          🎭 Status Effects & Keywords
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Conditions that affect character actions and abilities
        </Typography>
      </Paper>
      
      {/* All Status Effects in One Section */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ 
          bgcolor: alpha('#ff6b6b', 0.1), 
          p: 2, 
          borderBottom: '3px solid #ff6b6b'
        }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#ff6b6b' }}>
            📋 All Status Effects & Conditions
          </Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <Stack spacing={2}>
            {[
              // Debilitating Conditions
              {
                name: 'STAGGERED',
                effect: 'You may not use your action while staggered, including downgrading to a maneuver.',
                color: '#f44336',
                severity: 'Severe'
              },
              {
                name: 'IMMOBILIZED',
                effect: 'You may not use any maneuvers, including any that may be part of an extra effect.',
                color: '#f44336',
                severity: 'Severe'
              },
              {
                name: 'BLIND',
                effect: 'You add 3 difficulty to Perception and Vigilance checks and 2 to all other checks.',
                color: '#f44336',
                severity: 'Severe'
              },
              {
                name: 'DEAF',
                effect: 'You add 3 difficulty to Perception checks based on sound.',
                color: '#f44336',
                severity: 'Severe'
              },
              // Moderate Conditions
              {
                name: 'DISORIENTED',
                effect: 'You add one setback dice to all checks while Disoriented.',
                color: '#FF9800',
                severity: 'Moderate'
              },
              {
                name: 'ENCUMBERED',
                effect: 'For each point over the encumbrance threshold, that player receives a setback dice. While encumbered at or above brawn, the player\'s free maneuver is lost.',
                color: '#FF9800',
                severity: 'Moderate'
              },
              {
                name: 'GRAPPLE',
                effect: 'The target must succeed on a contested Brawl check to resist being grabbed. While grappled, you are immobilized. At the end of each of your turns, you may perform another contested Brawl check to escape.',
                color: '#FF9800',
                severity: 'Moderate'
              },
              {
                name: 'PRONE',
                effect: 'Melee attacks add a boost dice and ranged attacks add a setback dice when targeting a prone target.',
                color: '#FF9800',
                severity: 'Moderate'
              },
              // Environmental Effects
              {
                name: 'COVER',
                effect: 'While in cover, you receive 1 ranged defense and any attempting perception against you adds 1 setback dice.',
                color: '#2196F3',
                severity: 'Beneficial'
              },
              {
                name: 'DIFFICULT TERRAIN',
                effect: 'While traversing difficult terrain, it requires double the maneuvers to move.',
                color: '#2196F3',
                severity: 'Environmental'
              },
              {
                name: 'GRAVITY',
                effect: 'Stronger gravity adds 1-3 setback dice to all brawn and coordination checks, excluding resilience. Weaker gravity adds boost dice instead.',
                color: '#2196F3',
                severity: 'Environmental'
              },
              {
                name: 'HOLDING BREATH',
                effect: 'You can hold your breath for brawn rounds.',
                color: '#2196F3',
                severity: 'Environmental'
              },
              // Dangerous Conditions
              {
                name: 'SUFFOCATING',
                effect: 'You receive 3 strain damage each round. If you exceed your strain threshold, you receive a critical injury every round until you either stop suffocating or die.',
                color: '#d32f2f',
                severity: 'Dangerous'
              },
              {
                name: 'CRITICAL REMARK',
                effect: 'Inflict 5 strain to the target. This can be done in social conflict only.',
                color: '#d32f2f',
                severity: 'Dangerous'
              }
            ].map((condition, index) => (
              <Paper 
                key={index}
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: alpha(condition.color, 0.03),
                  border: '1px solid',
                  borderColor: alpha(condition.color, 0.2)
                }}
              >
                <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={2}>
                  <Box sx={{ flex: 1 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      <Chip 
                        label={condition.name} 
                        sx={{ 
                          bgcolor: condition.color, 
                          color: 'white', 
                          fontWeight: 'bold',
                          fontSize: '0.75rem'
                        }} 
                      />
                      <Chip 
                        label={condition.severity} 
                        size="small"
                        variant="outlined"
                        sx={{ 
                          color: condition.color,
                          borderColor: condition.color,
                          fontSize: '0.7rem'
                        }} 
                      />
                    </Box>
                    <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.85rem' }}>
                      {condition.effect}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Stack>
          
          {/* Quick Reference Guide */}
          <Paper 
            elevation={1} 
            sx={{ 
              mt: 3, 
              p: 2, 
              bgcolor: alpha('#4CAF50', 0.05),
              border: '1px dashed #4CAF50',
              borderRadius: 2
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="h5">💡</Typography>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                Quick Reference Guide
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ p: 1.5, bgcolor: alpha('#f44336', 0.1), borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="caption" fontWeight="bold" sx={{ color: '#f44336' }}>
                    SEVERE
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                    Major penalties or action restrictions
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ p: 1.5, bgcolor: alpha('#FF9800', 0.1), borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="caption" fontWeight="bold" sx={{ color: '#FF9800' }}>
                    MODERATE
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                    Minor penalties or limitations
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ p: 1.5, bgcolor: alpha('#2196F3', 0.1), borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="caption" fontWeight="bold" sx={{ color: '#2196F3' }}>
                    ENVIRONMENTAL
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                    Situational effects from surroundings
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ p: 1.5, bgcolor: alpha('#d32f2f', 0.1), borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="caption" fontWeight="bold" sx={{ color: '#d32f2f' }}>
                    DANGEROUS
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                    Life-threatening conditions
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Paper>
    </Box>,

    <Box key="combat" maxHeight="750px" overflow="auto" sx={{ p: 1 }}>
      {/* Header Section */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 2,
          background: 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)',
          borderRadius: 2,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          ⚔️ Combat System
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Movement, attack difficulties, and special combat rules
        </Typography>
      </Paper>
      
      <Stack spacing={2}>
        {/* Movement & Range */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#2196F3', 0.1), 
            p: 2, 
            borderBottom: '3px solid #2196F3'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#2196F3' }}>
              🏃 Movement & Range System
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {/* Movement Requirements */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: alpha('#4CAF50', 0.03),
                  border: '1px solid',
                  borderColor: alpha('#4CAF50', 0.2)
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <Chip 
                    label="1 MANEUVER" 
                    sx={{ 
                      bgcolor: '#4CAF50', 
                      color: 'white', 
                      fontWeight: 'bold',
                      fontSize: '0.75rem'
                    }} 
                  />
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                    Movement Requirements
                  </Typography>
                </Box>
                <Stack spacing={0.5} sx={{ pl: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                    • Engaged ↔ Short range
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                    • Short ↔ Medium range
                  </Typography>
                </Stack>
              </Paper>
                  
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: alpha('#FF9800', 0.03),
                  border: '1px solid',
                  borderColor: alpha('#FF9800', 0.2)
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <Chip 
                    label="2 MANEUVERS" 
                    sx={{ 
                      bgcolor: '#FF9800', 
                      color: 'white', 
                      fontWeight: 'bold',
                      fontSize: '0.75rem'
                    }} 
                  />
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#FF9800' }}>
                    Movement Requirements
                  </Typography>
                </Box>
                <Stack spacing={0.5} sx={{ pl: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                    • Medium ↔ Long range
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                    • Long ↔ Extreme range
                  </Typography>
                </Stack>
              </Paper>
                  
              {/* Range Distances */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: alpha('#2196F3', 0.03),
                  border: '1px solid',
                  borderColor: alpha('#2196F3', 0.2)
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#2196F3' }} gutterBottom>
                  📏 Range Distances
                </Typography>
                <Grid container spacing={1}>
                  {[
                    { name: 'Engaged', distance: '0-3 feet' },
                    { name: 'Short', distance: '4-33 feet' },
                    { name: 'Medium', distance: '34-144 feet' },
                    { name: 'Long', distance: '145-500 feet' },
                    { name: 'Extreme', distance: '501+ feet' }
                  ].map((range, index) => (
                    <Grid item xs={6} sm={4} md={2.4} key={index}>
                      <Box 
                        textAlign="center" 
                        p={1} 
                        sx={{ 
                          bgcolor: alpha('#2196F3', 0.1), 
                          borderRadius: 1,
                          minHeight: '60px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center'
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.8rem' }}>
                          {range.name}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                          {range.distance}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Stack>
          </Box>
        </Paper>
                
        {/* Attack Difficulties */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#f44336', 0.1), 
            p: 2, 
            borderBottom: '3px solid #f44336'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#f44336' }}>
              🎯 Attack Difficulties by Range
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {/* Melee Attacks */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: alpha('#f44336', 0.03),
                  border: '1px solid',
                  borderColor: alpha('#f44336', 0.2)
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#f44336' }} gutterBottom>
                  🗡️ Melee Attack Difficulty
                </Typography>
                <Stack spacing={1}>
                  {[
                    { range: 'Engaged', difficulty: '2', color: '#f44336' },
                    { range: 'Short (with reach)', difficulty: '3', color: '#f44336' },
                    { range: 'Medium+', difficulty: 'N/A', color: '#9e9e9e', disabled: true }
                  ].map((attack, index) => (
                    <Box 
                      key={index}
                      display="flex" 
                      justifyContent="space-between" 
                      alignItems="center" 
                      p={1} 
                      sx={{ 
                        bgcolor: alpha(attack.color, attack.disabled ? 0.05 : 0.1), 
                        borderRadius: 1,
                        minHeight: '40px'
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        fontWeight="medium" 
                        sx={{ 
                          fontSize: '0.85rem',
                          color: attack.disabled ? 'text.secondary' : 'text.primary'
                        }}
                      >
                        {attack.range}
                      </Typography>
                      <Chip 
                        label={attack.difficulty} 
                        size="small" 
                        sx={{ 
                          bgcolor: attack.disabled ? 'transparent' : attack.color, 
                          color: attack.disabled ? attack.color : 'white', 
                          fontWeight: 'bold',
                          ...(attack.disabled && { border: `1px solid ${attack.color}` })
                        }} 
                        variant={attack.disabled ? "outlined" : "filled"}
                      />
                    </Box>
                  ))}
                </Stack>
              </Paper>
                
              {/* Ranged Attacks */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: alpha('#f44336', 0.03),
                  border: '1px solid',
                  borderColor: alpha('#f44336', 0.2)
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#f44336' }} gutterBottom>
                  🏹 Ranged Attack Difficulty
                </Typography>
                <Stack spacing={1}>
                  {[
                    { range: 'Engaged (1-handed)', difficulty: '2', color: '#f44336' },
                    { range: 'Engaged (2-handed)', difficulty: '3', color: '#f44336' },
                    { range: 'Short', difficulty: '1', color: '#4CAF50' },
                    { range: 'Medium', difficulty: '2', color: '#f44336' },
                    { range: 'Long', difficulty: '3', color: '#f44336' },
                    { range: 'Extreme', difficulty: '4', color: '#d32f2f' }
                  ].map((attack, index) => (
                    <Box 
                      key={index}
                      display="flex" 
                      justifyContent="space-between" 
                      alignItems="center" 
                      p={1} 
                      sx={{ 
                        bgcolor: alpha(attack.color, 0.1), 
                        borderRadius: 1,
                        minHeight: '40px'
                      }}
                    >
                      <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem' }}>
                        {attack.range}
                      </Typography>
                      <Chip 
                        label={attack.difficulty} 
                        size="small" 
                        sx={{ 
                          bgcolor: attack.color, 
                          color: 'white', 
                          fontWeight: 'bold' 
                        }} 
                      />
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Box>
        </Paper>
                
        {/* Dual Wielding */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#9C27B0', 0.1), 
            p: 2, 
            borderBottom: '3px solid #9C27B0'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#9C27B0' }}>
              ⚔️ Dual Wielding Rules
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                borderRadius: 2,
                bgcolor: alpha('#9C27B0', 0.03),
                border: '1px solid',
                borderColor: alpha('#9C27B0', 0.2)
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#9C27B0' }} gutterBottom>
                📋 Step-by-Step Process
              </Typography>
              <Stack spacing={1}>
                {[
                  "Determine which weapon will attack first",
                  "Consider both weapons' skills",
                  "Take the lowest skill",
                  "Consider both weapons' Characteristics", 
                  "Take the lowest Characteristic",
                  "Consider both weapons' attack difficulty",
                  "Take the higher difficulty and add 1",
                  "Attack",
                  "Spend two advantages to deal the other weapon's damage (optional)"
                ].map((step, index) => (
                  <Box 
                    key={index}
                    display="flex" 
                    alignItems="center" 
                    gap={2} 
                    p={1} 
                    sx={{ 
                      bgcolor: alpha('#9C27B0', 0.05), 
                      borderRadius: 1,
                      minHeight: '40px'
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 24, 
                        height: 24, 
                        borderRadius: '50%', 
                        bgcolor: '#9C27B0',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                      {step}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Box>
        </Paper>
              
        {/* Critical Injuries */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#d32f2f', 0.1), 
            p: 2, 
            borderBottom: '3px solid #d32f2f'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#d32f2f' }}>
              💥 Critical Injury Rules
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: alpha('#d32f2f', 0.03),
                  border: '1px solid',
                  borderColor: alpha('#d32f2f', 0.2)
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#d32f2f' }} gutterBottom>
                  ⚡ Application Requirements
                </Typography>
                <Stack spacing={0.5} sx={{ pl: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                    • Attack must deal more damage than target's soak
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                    • Triumphs can apply critical injuries on any successful hit
                  </Typography>
                </Stack>
              </Paper>
              
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: alpha('#d32f2f', 0.03),
                  border: '1px solid',
                  borderColor: alpha('#d32f2f', 0.2)
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#d32f2f' }} gutterBottom>
                  📊 Multiple Injuries & Thresholds
                </Typography>
                <Stack spacing={0.5} sx={{ pl: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                    • Each additional critical injury in one attack: +10 to roll
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                    • Exceeding wound threshold: automatic critical injury (once per combat)
                  </Typography>
                </Stack>
              </Paper>
            </Stack>
          </Box>
        </Paper>
              
        {/* Quick Reference */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            bgcolor: alpha('#4CAF50', 0.05),
            border: '1px dashed #4CAF50',
            borderRadius: 2
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h5">💡</Typography>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                Combat Quick Tips
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                • Short range is optimal for most ranged weapons (Difficulty 1)
                • Engaged range penalizes ranged attacks but favors melee
                • Dual wielding uses lowest stats but higher difficulty
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Stack>
    </Box>,

    <Box key="hacking" maxHeight="750px" overflow="auto" sx={{ p: 1 }}>
      {/* Header Section */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 2,
          background: 'linear-gradient(135deg,rgb(0, 124, 66) 0%,rgb(3, 136, 69) 100%)',
          borderRadius: 2,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          💻 Hacking System
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Digital infiltration • Terminal access required • Shares combat initiative
        </Typography>
      </Paper>
      
      <Stack spacing={2}>
        {/* Hacking Process */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#00ff88', 0.1), 
            p: 2, 
            borderBottom: '3px solid rgb(0, 124, 66)'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#00cc66' }}>
              🔓 Hacking Process
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {/* Step 1: Access System */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: alpha('#00ff88', 0.03),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#00ff88', 0.3)}`
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 2, 
                      bgcolor: '#00ff88',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      flexShrink: 0
                    }}
                  >
                    1
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" color="#00cc66">
                      Access System
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                      Computers skill check based on system security level
                    </Typography>
                  </Box>
                </Box>
                  
                <Typography variant="body2" fontWeight="bold" sx={{ color: '#00cc66', mb: 1 }}>
                  Security Levels:
                </Typography>
                <Stack spacing={1}>
                  {[
                    { name: 'Unsecured/Password Known', diff: 0, color: '#4CAF50' },
                    { name: 'Public Terminal, PAD, Personal Computer', diff: 1, color: '#8BC34A' },
                    { name: 'Small Business Server', diff: 2, color: '#FFC107' },
                    { name: 'Government Network/Corporate Server', diff: 3, color: '#FF9800' },
                    { name: 'Hacker Darknet or Military Server', diff: 4, color: '#FF5722' },
                    { name: 'Megacorp Core System, Intelligence Agency', diff: 5, color: '#D32F2F' }
                  ].map((system, index) => (
                    <Box 
                      key={index}
                      display="flex" 
                      justifyContent="space-between" 
                      alignItems="center" 
                      p={1} 
                      sx={{ 
                        bgcolor: alpha(system.color, 0.1), 
                        borderRadius: 1,
                        border: `1px solid ${alpha(system.color, 0.3)}`
                      }}
                    >
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                        {system.name}
                      </Typography>
                      <Chip 
                        label={`Diff ${system.diff}`} 
                        size="small" 
                        sx={{ 
                          bgcolor: system.color, 
                          color: 'white', 
                          fontWeight: 'bold',
                          fontSize: '0.7rem'
                        }} 
                      />
                    </Box>
                  ))}
                </Stack>
              </Paper>
                
              {/* Step 2: Override Security */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: alpha('#00ff88', 0.03),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#00ff88', 0.3)}`
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 2, 
                      bgcolor: '#00ff88',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      flexShrink: 0
                    }}
                  >
                    2
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" color="#00cc66">
                      Override Security Programs
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                      Difficulty 2 Computers check
                    </Typography>
                  </Box>
                </Box>
              </Paper>
                  
              {/* Step 3: System Control */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: alpha('#00ff88', 0.03),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#00ff88', 0.3)}`
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 2, 
                      bgcolor: '#00ff88',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      flexShrink: 0
                    }}
                  >
                    3
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold" color="#00cc66">
                      System Control
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                      Unlocks new maneuvers
                    </Typography>
                  </Box>
                </Box>
                <Stack spacing={0.5} sx={{ pl: 2, mt: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                    • Enact Command
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                    • Activate Programs
                  </Typography>
                </Stack>
              </Paper>
            </Stack>
          </Box>
        </Paper>
                  
        {/* Defending Against Hacks */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#f44336', 0.1), 
            p: 2, 
            borderBottom: '3px solid #f44336'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#f44336' }}>
              🛡️ Defending Against Hacks
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {/* Trace User */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: alpha('#f44336', 0.03),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#f44336', 0.2)}`
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#f44336' }} gutterBottom>
                  🔍 Step 1: Trace User
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.85rem', mb: 1 }}>
                  Contested Computers check to locate the hacker
                </Typography>
                <Stack spacing={1}>
                  {[
                    { success: '1st', info: 'Hacker\'s level known, Lockout -1 difficulty' },
                    { success: '2nd', info: 'Group associations known, Lockout -1 difficulty' },
                    { success: '3rd', info: 'Exact location known, Lockout -1 difficulty' },
                    { success: '4th', info: 'Access point identified, Lockout -1 difficulty' },
                    { success: '5th+', info: 'Personal data revealed (name, age, etc.)' }
                  ].map((trace, index) => (
                    <Box 
                      key={index}
                      display="flex" 
                      alignItems="flex-start" 
                      gap={1}
                      sx={{ 
                        p: 1, 
                        bgcolor: alpha('#f44336', 0.05),
                        borderRadius: 1
                      }}
                    >
                      <Chip 
                        label={trace.success} 
                        size="small" 
                        sx={{ 
                          bgcolor: '#f44336', 
                          color: 'white',
                          minWidth: 40,
                          fontSize: '0.7rem'
                        }} 
                      />
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                        {trace.info}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
                
              {/* Lockout */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: alpha('#f44336', 0.03),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#f44336', 0.2)}`
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#f44336' }} gutterBottom>
                  🚫 Step 2: Lockout
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.85rem', mb: 1 }}>
                  Remove hacker from system
                </Typography>
                <Box sx={{ p: 1.5, bgcolor: alpha('#f44336', 0.1), borderRadius: 1 }}>
                  <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ fontSize: '0.85rem' }}>
                    On Success:
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                    • Hacker loses system access<br />
                    • Re-entry difficulty +2 (if allowed)
                  </Typography>
                </Box>
              </Paper>
            </Stack>
          </Box>
        </Paper>
              
        {/* Security Programs */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#FF9800', 0.1), 
            p: 2, 
            borderBottom: '3px solid #FF9800'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#FF9800' }}>
              🔒 Security Programs
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {[
                { 
                  name: 'Firewall', 
                  strength: 3, 
                  failure: 'None',
                  icon: '🛡️',
                  color: '#2196F3'
                },
                { 
                  name: 'Sentry', 
                  strength: 2, 
                  failure: 'Sysops notified, automatic Trace success',
                  icon: '👁️',
                  color: '#FF9800'
                },
                { 
                  name: 'Gate', 
                  strength: 2, 
                  failure: 'Lose system access',
                  icon: '🚪',
                  color: '#f44336'
                },
                { 
                  name: 'Gate (Pop-up)', 
                  strength: 1, 
                  failure: '2 strain damage + existential crisis',
                  icon: '📧',
                  color: '#9C27B0'
                }
              ].map((program, index) => (
                <Paper 
                  key={index}
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    bgcolor: alpha(program.color, 0.03),
                    borderRadius: 2,
                    border: `1px solid ${alpha(program.color, 0.2)}`
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Typography variant="h5">{program.icon}</Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: program.color }}>
                        {program.name}
                      </Typography>
                      <Chip 
                        label={`Strength ${program.strength}`} 
                        size="small" 
                        sx={{ 
                          bgcolor: program.color, 
                          color: 'white',
                          fontSize: '0.7rem'
                        }} 
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    <strong>Failure:</strong> {program.failure}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Paper>
            
        {/* Spending Results */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#4CAF50', 0.1), 
            p: 2, 
            borderBottom: '3px solid #4CAF50'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#4CAF50' }}>
              🎲 Spending Roll Results
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {/* Advantages */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: alpha('#4CAF50', 0.03),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#4CAF50', 0.2)}`
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#4CAF50' }} gutterBottom>
                  ✅ Advantages
                </Typography>
                <Stack spacing={1}>
                  {[
                    {
                      cost: 1,
                      options: [
                        'Add boost dice to next Computers check',
                        'Delay security program reactivation (Hacker)'
                      ]
                    },
                    {
                      cost: 2,
                      options: [
                        'Extra Enact Command as incidental',
                        'Add setback to next Trace (Hacker)',
                        'Modify program: +1 setback to Override (Defender)'
                      ]
                    },
                    {
                      cost: 3,
                      options: [
                        'Inflict 3 strain damage',
                        'Create backdoor access (Hacker)',
                        'Auto-succeed on Trace (Defender)'
                      ]
                    }
                  ].map((advantage, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        p: 1.5, 
                        bgcolor: alpha('#4CAF50', 0.05),
                        borderRadius: 1,
                        border: `1px solid ${alpha('#4CAF50', 0.2)}`
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Chip 
                          label={advantage.cost} 
                          size="small" 
                          sx={{ 
                            bgcolor: '#4CAF50', 
                            color: 'white',
                            fontWeight: 'bold',
                            minWidth: 24,
                            height: 24
                          }} 
                        />
                        <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.85rem' }}>
                          Advantage{advantage.cost > 1 ? 's' : ''}
                        </Typography>
                      </Box>
                      <Stack spacing={0.5} sx={{ pl: 2 }}>
                        {advantage.options.map((option, optIndex) => (
                          <Typography key={optIndex} variant="body2" sx={{ fontSize: '0.8rem' }}>
                            • {option}
                          </Typography>
                        ))}
                      </Stack>
                    </Box>
                  ))}

                  {/* Triumph */}
                  <Box 
                    sx={{ 
                      p: 1.5, 
                      bgcolor: alpha('#FF9800', 0.05),
                      borderRadius: 1,
                      border: `1px solid ${alpha('#FF9800', 0.2)}`
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <Chip 
                        label="⚡" 
                        size="small" 
                        sx={{ 
                          bgcolor: '#FF9800', 
                          color: 'white',
                          fontWeight: 'bold',
                          minWidth: 24,
                          height: 24
                        }} 
                      />
                      <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.85rem' }}>
                        Triumph
                      </Typography>
                    </Box>
                    <Stack spacing={0.5} sx={{ pl: 2 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>• Permanently disable program (Hacker)</Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>• Cancel successful Trace (Hacker)</Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>• Add strength 3 backup firewall (Defender)</Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>• Remove backdoor access (Defender)</Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
                      
              {/* Threats */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: alpha('#f44336', 0.03),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#f44336', 0.2)}`
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#f44336' }} gutterBottom>
                  ❌ Threats
                </Typography>
                <Stack spacing={1}>
                  {[
                    {
                      cost: 1,
                      options: [
                        'Setback to next Computers check',
                        'Two setbacks to non-Computers checks'
                      ]
                    },
                    {
                      cost: 2,
                      options: [
                        'Only action OR maneuver next turn (Hacker)',
                        'Double Trace success next time (Defender)',
                        'Reduce system strength to min 1 (Defender)'
                      ]
                    },
                    {
                      cost: 3,
                      options: [
                        'All users aware of hack (Hacker)',
                        'Accidental backdoor created (Defender)'
                      ]
                    }
                  ].map((threat, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        p: 1.5, 
                        bgcolor: alpha('#f44336', 0.05),
                        borderRadius: 1,
                        border: `1px solid ${alpha('#f44336', 0.2)}`
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Chip 
                          label={threat.cost} 
                          size="small" 
                          sx={{ 
                            bgcolor: '#f44336', 
                            color: 'white',
                            fontWeight: 'bold',
                            minWidth: 24,
                            height: 24
                          }} 
                        />
                        <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.85rem' }}>
                          Threat{threat.cost > 1 ? 's' : ''}
                        </Typography>
                      </Box>
                      <Stack spacing={0.5} sx={{ pl: 2 }}>
                        {threat.options.map((option, optIndex) => (
                          <Typography key={optIndex} variant="body2" sx={{ fontSize: '0.8rem' }}>
                            • {option}
                          </Typography>
                        ))}
                      </Stack>
                    </Box>
                  ))}

                  {/* Despair */}
                  <Box 
                    sx={{ 
                      p: 1.5, 
                      bgcolor: alpha('#9c27b0', 0.05),
                      borderRadius: 1,
                      border: `1px solid ${alpha('#9c27b0', 0.2)}`
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <Chip 
                        label="💀" 
                        size="small" 
                        sx={{ 
                          bgcolor: '#9c27b0', 
                          color: 'white',
                          fontWeight: 'bold',
                          minWidth: 24,
                          height: 24
                        }} 
                      />
                      <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.85rem' }}>
                        Despair
                      </Typography>
                    </Box>
                    <Stack spacing={0.5} sx={{ pl: 2 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>• Allow auto-success on Trace (Hacker)</Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>• Wrong target traced (Defender)</Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Box>
        </Paper>
                      
        {/* Quick Reference */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            bgcolor: alpha('#2196F3', 0.05),
            border: '1px dashed #2196F3',
            borderRadius: 2
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h5">💡</Typography>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#2196F3' }}>
                Hacking Quick Tips
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                • Higher security systems require more difficult Computers checks
                • Successful traces make lockout easier for defenders
                • Triumphs can permanently disable security programs
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Stack>
    </Box>,

    // Healing
    <Box key="healing" maxHeight="750px" overflow="auto" sx={{ p: 1 }}>
      {/* Header Section */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 2,
          background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
          borderRadius: 2,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          🏥 Healing & Recovery System
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Medicine checks, automatic healing, and recovery mechanics
        </Typography>
      </Paper>
      
      <Stack spacing={2}>
        {/* Medicine Check Applications */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#4CAF50', 0.1), 
            p: 2, 
            borderBottom: '3px solid #4CAF50'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#4CAF50' }}>
              💉 Medicine Check Applications
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {/* Daily Medicine Check */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: alpha('#4CAF50', 0.03),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#4CAF50', 0.3)}`
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#4CAF50' }} gutterBottom>
                  📅 Daily Medicine Check
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', mb: 1 }}>
                  One attempt per day • Resets at dawn
                </Typography>
                
                <Stack spacing={1}>
                  <Box sx={{ p: 1.5, bgcolor: alpha('#4CAF50', 0.1), borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ fontSize: '0.85rem' }}>
                      🩹 Healing Wounds & Strain
                    </Typography>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>• Each Success = 1 wound healed</Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>• Each Advantage = 1 strain healed</Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>• Triumph = +3 wounds or strain</Typography>
                    </Stack>
                  </Box>
                  
                  <Box sx={{ p: 1.5, bgcolor: alpha('#FF9800', 0.1), borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ fontSize: '0.85rem' }}>
                      ⚠️ Critical Injuries
                    </Typography>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>• Success = Injury removed</Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>• Failure = No effect</Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#FF9800', fontWeight: 'medium' }}>
                        Failed attempts cannot be retried for 1 week
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
              
              {/* Revitalization Check */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: alpha('#2196F3', 0.03),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#2196F3', 0.3)}`
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#2196F3' }} gutterBottom>
                  ⚡ Revitalization (Separate Check)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', mb: 1 }}>
                  Remove exhaustion • Does not use daily medicine check
                </Typography>
                
                <Box sx={{ p: 1.5, bgcolor: alpha('#2196F3', 0.1), borderRadius: 1 }}>
                  <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ fontSize: '0.85rem' }}>
                    Daily Exhaustion Removal
                  </Typography>
                  <Stack spacing={0.5}>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>• Difficulty = Exhaustion level being removed</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>• One level per day maximum</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>• Success removes the targeted level</Typography>
                  </Stack>
                </Box>
              </Paper>
            </Stack>
          </Box>
        </Paper>
              
        {/* Medicine Check Difficulties */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#FF9800', 0.1), 
            p: 2, 
            borderBottom: '3px solid #FF9800'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#FF9800' }}>
              🎯 Medicine Check Difficulties
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {/* Base Difficulties */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: alpha('#FF9800', 0.03),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#FF9800', 0.3)}`
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#FF9800' }} gutterBottom>
                  📊 Base Difficulties by Condition
                </Typography>
                <Stack spacing={1}>
                  {[
                    { condition: 'At half or lower wounds', difficulty: 1, color: '#4CAF50' },
                    { condition: 'At more than half wounds', difficulty: 2, color: '#FF9800' },
                    { condition: 'Over wound threshold', difficulty: 3, color: '#f44336' },
                    { condition: 'Critical injury', difficulty: 'Variable', color: '#2196F3', note: 'Based on injury severity' }
                  ].map((item, index) => (
                    <Box 
                      key={index}
                      display="flex" 
                      justifyContent="space-between" 
                      alignItems="center" 
                      p={1.5} 
                      sx={{ 
                        bgcolor: alpha(item.color, 0.1), 
                        borderRadius: 1,
                        border: `1px solid ${alpha(item.color, 0.3)}`
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem' }}>
                          {item.condition}
                        </Typography>
                        {item.note && (
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            {item.note}
                          </Typography>
                        )}
                      </Box>
                      <Chip 
                        label={`Diff ${item.difficulty}`} 
                        size="small" 
                        sx={{ 
                          bgcolor: item.color, 
                          color: 'white', 
                          fontWeight: 'bold',
                          fontSize: '0.7rem'
                        }} 
                      />
                    </Box>
                  ))}
                </Stack>
              </Paper>
                
              {/* Difficulty Modifiers */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: alpha('#f44336', 0.03),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#f44336', 0.3)}`
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#f44336' }} gutterBottom>
                  ⬆️ Difficulty Modifiers
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ p: 1.5, bgcolor: alpha('#f44336', 0.1), borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem' }}>No Medical Tools</Typography>
                    <Typography variant="body2" sx={{ color: '#f44336', fontSize: '0.8rem' }}>+1 Difficulty</Typography>
                  </Box>
                  <Box sx={{ p: 1.5, bgcolor: alpha('#f44336', 0.1), borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem' }}>Healing Yourself</Typography>
                    <Typography variant="body2" sx={{ color: '#f44336', fontSize: '0.8rem' }}>+2 Difficulty</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Box>
        </Paper>
              
        {/* Automatic Healing Methods */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#2196F3', 0.1), 
            p: 2, 
            borderBottom: '3px solid #2196F3'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#2196F3' }}>
              🔄 Automatic Healing Methods
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {/* Post-Combat Recovery */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: alpha('#2196F3', 0.03),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#2196F3', 0.3)}`
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 2, 
                      bgcolor: '#2196F3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      flexShrink: 0
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">🛡️</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#2196F3' }}>
                      Post-Combat Strain Recovery
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      After each combat encounter
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: alpha('#2196F3', 0.1), borderRadius: 1 }}>
                  <Typography variant="body2" fontWeight="medium" gutterBottom sx={{ fontSize: '0.85rem' }}>
                    Difficulty 0 Cool or Discipline Check
                  </Typography>
                  <Stack spacing={0.5}>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>• Each Success = 1 strain recovered</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>• No failure penalties</Typography>
                  </Stack>
                </Box>
              </Paper>
                  
              {/* Painkillers */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: alpha('#9C27B0', 0.03),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#9C27B0', 0.3)}`
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 2, 
                      bgcolor: '#9C27B0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      flexShrink: 0
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">💊</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#9C27B0' }}>
                      Painkiller Usage
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      Diminishing returns system
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: alpha('#9C27B0', 0.1), borderRadius: 1 }}>
                  <Typography variant="body2" fontWeight="medium" gutterBottom sx={{ fontSize: '0.85rem' }}>
                    Healing Formula: 5 - (times used)
                  </Typography>
                  <Stack spacing={0.5}>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>• 1st use: 4 healing</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>• 2nd use: 3 healing</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>• 5th+ use: 0 healing</Typography>
                    <Typography variant="body2" sx={{ color: '#9C27B0', fontWeight: 'medium', fontSize: '0.8rem', mt: 0.5 }}>
                      Resets after 24 hours from first use
                    </Typography>
                  </Stack>
                </Box>
              </Paper>
            </Stack>
          </Box>
        </Paper>
                  
        {/* Quick Reference */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            bgcolor: alpha('#4CAF50', 0.05),
            border: '1px dashed #4CAF50',
            borderRadius: 2
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h5">💡</Typography>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                Healing Quick Tips
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                • Daily medicine checks reset at dawn
                • Critical injury failures have a 1-week cooldown
                • Post-combat strain recovery is automatic and risk-free
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Stack>
    </Box>,

    // Time
    <Box key="time" maxHeight="750px" overflow="auto" sx={{ p: 1 }}>
      {/* Header Section */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 2,
          background: 'linear-gradient(135deg, #673AB7 0%, #512DA8 100%)',
          borderRadius: 2,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          ⏰ Time & Sanity System
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Room-based time tracking • Time dilation effects • Sanity degradation
        </Typography>
      </Paper>
      
      <Stack spacing={2}>
        {/* Time Passage Mechanics */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#673AB7', 0.1), 
            p: 2, 
            borderBottom: '3px solid #673AB7'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#673AB7' }}>
              🚪 Time Passage Mechanics
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {/* Base Room Times */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: alpha('#673AB7', 0.03),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#673AB7', 0.3)}`
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#673AB7' }} gutterBottom>
                  🏠 Base Room Traversal Times
                </Typography>
                <Stack spacing={1}>
                  {[
                    { size: 'Small/Medium Room', time: '1 minute', color: '#4CAF50' },
                    { size: 'Large Room', time: '2 minutes', color: '#FF9800' },
                    { size: 'Combat Round', time: '1 minute', color: '#f44336', note: 'Regardless of room size' }
                  ].map((room, index) => (
                    <Box 
                      key={index}
                      display="flex" 
                      justifyContent="space-between" 
                      alignItems="center" 
                      p={1.5} 
                      sx={{ 
                        bgcolor: alpha(room.color, 0.1), 
                        borderRadius: 1,
                        border: `1px solid ${alpha(room.color, 0.3)}`
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem' }}>
                          {room.size}
                        </Typography>
                        {room.note && (
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            {room.note}
                          </Typography>
                        )}
                      </Box>
                      <Chip 
                        label={room.time} 
                        size="small" 
                        sx={{ 
                          bgcolor: room.color, 
                          color: 'white', 
                          fontWeight: 'bold',
                          fontSize: '0.7rem'
                        }} 
                      />
                    </Box>
                  ))}
                </Stack>
              </Paper>
                
              {/* Time Modifiers */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: alpha('#2196F3', 0.03),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#2196F3', 0.3)}`
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#2196F3' }} gutterBottom>
                  ⚙️ Time Modification Factors
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ p: 1.5, bgcolor: alpha('#2196F3', 0.1), borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ fontSize: '0.85rem' }}>
                      Actions in Room
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>+1 minute per action performed</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      Simultaneous actions by different players don't stack
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, bgcolor: alpha('#FF9800', 0.1), borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ fontSize: '0.85rem' }}>
                      Level Time Dilation
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Multiplier varies by area/level</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      Range: 0.5x (twice as slow) to 2x (twice as fast)
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Box>
        </Paper>
              
        {/* Time Calculation Example */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#9C27B0', 0.1), 
            p: 2, 
            borderBottom: '3px solid #9C27B0'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#9C27B0' }}>
              🧮 Time Calculation Example
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                bgcolor: alpha('#9C27B0', 0.03),
                borderRadius: 2,
                border: `1px solid ${alpha('#9C27B0', 0.3)}`
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#9C27B0' }} gutterBottom>
                📋 Step-by-Step Calculation
              </Typography>
              <Stack spacing={1}>
                {[
                  { step: '1', desc: 'Small room base time', value: '1 minute' },
                  { step: '2', desc: 'Examine object action', value: '+1 minute' },
                  { step: '3', desc: 'Search room action', value: '+1 minute' },
                  { step: '4', desc: 'Subtotal before dilation', value: '3 minutes' },
                  { step: '5', desc: 'Apply 1.5x time dilation', value: '×1.5 = 4.5 minutes' },
                  { step: '6', desc: 'Round normally', value: '5 minutes total' }
                ].map((calc, index) => (
                  <Box 
                    key={index}
                    display="flex" 
                    alignItems="center" 
                    gap={2} 
                    p={1.5} 
                    sx={{ 
                      bgcolor: alpha('#9C27B0', 0.05), 
                      borderRadius: 1,
                      border: `1px solid ${alpha('#9C27B0', 0.2)}`
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 24, 
                        height: 24, 
                        borderRadius: '50%', 
                        bgcolor: '#9C27B0',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}
                    >
                      {calc.step}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{calc.desc}</Typography>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: '#9C27B0', fontSize: '0.8rem' }}>
                        {calc.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Box>
        </Paper>
              
        {/* Sanity Check System */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#f44336', 0.1), 
            p: 2, 
            borderBottom: '3px solid #f44336'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#f44336' }}>
              🧠 Time-Based Sanity Degradation
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {/* Sanity Check Requirements */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: alpha('#f44336', 0.03),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#f44336', 0.3)}`
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#f44336' }} gutterBottom>
                  ⚠️ Sanity Check Trigger
                </Typography>
                <Box sx={{ p: 1.5, bgcolor: alpha('#f44336', 0.1), borderRadius: 1 }}>
                  <Typography variant="body2" fontWeight="medium" gutterBottom sx={{ fontSize: '0.85rem' }}>
                    Required on levels with Survival Difficulty ≥ 1
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                    Must check periodically based on danger level
                  </Typography>
                </Box>
              </Paper>
              
              {/* Sanity Check Intervals */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: alpha('#f44336', 0.03),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#f44336', 0.3)}`
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#f44336' }} gutterBottom>
                  ⏱️ Check Intervals by Survival Difficulty
                </Typography>
                <Stack spacing={1}>
                  {[
                    { level: 1, time: '4 hours', color: '#4CAF50' },
                    { level: 2, time: '2 hours', color: '#8BC34A' },
                    { level: 3, time: '1 hour', color: '#FFC107' },
                    { level: 4, time: '30 minutes', color: '#FF9800' },
                    { level: 5, time: '15 minutes', color: '#f44336' }
                  ].map((difficulty, index) => (
                    <Box 
                      key={index}
                      display="flex" 
                      justifyContent="space-between" 
                      alignItems="center" 
                      p={1.5} 
                      sx={{ 
                        bgcolor: alpha(difficulty.color, 0.1), 
                        borderRadius: 1,
                        border: `1px solid ${alpha(difficulty.color, 0.3)}`
                      }}
                    >
                      <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem' }}>
                        Survival Difficulty {difficulty.level}
                      </Typography>
                      <Chip 
                        label={difficulty.time} 
                        size="small" 
                        sx={{ 
                          bgcolor: difficulty.color, 
                          color: 'white', 
                          fontWeight: 'bold',
                          fontSize: '0.7rem'
                        }} 
                      />
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Box>
        </Paper>
                
        {/* Quick Reference */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            bgcolor: alpha('#673AB7', 0.05),
            border: '1px dashed #673AB7',
            borderRadius: 2
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h5">💡</Typography>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#673AB7' }}>
                Time Tracking Quick Tips
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                • Base room time + actions + time dilation = total time
                • Higher survival difficulty = more frequent sanity checks
                • Combat rounds are always 1 minute regardless of room size
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Stack>
    </Box>,

    // Durability and Repairs
    <Box key="durability" maxHeight="750px" overflow="auto" sx={{ p: 1 }}>
      {/* Header Section */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 2,
          background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          borderRadius: 2,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          🔧 Durability & Repair System
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Equipment degradation effects • Repair mechanics • Cost calculations
        </Typography>
      </Paper>
      
      <Stack spacing={2}>
        {/* Weapon Durability */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#f44336', 0.1), 
            p: 2, 
            borderBottom: '3px solid #f44336'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#f44336' }}>
              ⚔️ Weapon Durability Effects
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={1}>
              {[
                { 
                  durability: 'Maximum', 
                  effect: 'No effects', 
                  color: '#4CAF50',
                  severity: 'Perfect'
                },
                { 
                  durability: 'Lost 1', 
                  effect: 'Add 1 setback dice to all weapon checks', 
                  color: '#8BC34A',
                  severity: 'Minor Wear'
                },
                { 
                  durability: 'Lost 2', 
                  effect: 'Increase difficulty by 1 when using weapon', 
                  color: '#FFC107',
                  severity: 'Moderate'
                },
                { 
                  durability: 'Lost 3', 
                  effect: 'Upgrade 1 difficulty dice when using weapon', 
                  color: '#FF9800',
                  severity: 'Heavy'
                },
                { 
                  durability: 'Lost 4', 
                  effect: 'Weapon becomes unwieldy - treat skill as tier 0', 
                  color: '#FF5722',
                  severity: 'Critical'
                },
                { 
                  durability: 'Lost 5', 
                  effect: 'Weapon breaks - loses all effects and bonuses', 
                  color: '#D32F2F',
                  severity: 'Broken'
                }
              ].map((weapon, index) => (
                <Paper 
                  key={index}
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    bgcolor: alpha(weapon.color, 0.03),
                    borderRadius: 2,
                    border: `1px solid ${alpha(weapon.color, 0.3)}`
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                    <Box sx={{ flex: 1 }}>
                      <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: weapon.color }}>
                          {weapon.durability}
                        </Typography>
                        <Chip 
                          label={weapon.severity} 
                          size="small" 
                          sx={{ 
                            bgcolor: weapon.color, 
                            color: 'white',
                            fontSize: '0.7rem'
                          }} 
                        />
                      </Box>
                      <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.85rem' }}>
                        {weapon.effect}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Paper>
            
        {/* Armor Durability */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#2196F3', 0.1), 
            p: 2, 
            borderBottom: '3px solid #2196F3'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#2196F3' }}>
              🛡️ Armor Durability Effects
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={1}>
              {[
                { 
                  durability: 'Maximum', 
                  effect: 'No effects', 
                  color: '#4CAF50',
                  severity: 'Perfect'
                },
                { 
                  durability: 'Lost 1', 
                  effect: 'Add 1 setback dice to all Brawn and Agility checks', 
                  color: '#8BC34A',
                  severity: 'Minor Wear'
                },
                { 
                  durability: 'Lost 2', 
                  effect: 'Lose 1 defense and 1 soak', 
                  color: '#FFC107',
                  severity: 'Moderate'
                },
                { 
                  durability: 'Lost 3', 
                  effect: 'Increase difficulty of all Brawn and Agility checks by 1', 
                  color: '#FF9800',
                  severity: 'Heavy'
                },
                { 
                  durability: 'Lost 4', 
                  effect: 'Upgrade 1 difficulty dice for all Brawn and Agility checks', 
                  color: '#FF5722',
                  severity: 'Critical'
                },
                { 
                  durability: 'Lost 5', 
                  effect: 'Armor breaks - loses all effects', 
                  color: '#D32F2F',
                  severity: 'Broken'
                }
              ].map((armor, index) => (
                <Paper 
                  key={index}
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    bgcolor: alpha(armor.color, 0.03),
                    borderRadius: 2,
                    border: `1px solid ${alpha(armor.color, 0.3)}`
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                    <Box sx={{ flex: 1 }}>
                      <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: armor.color }}>
                          {armor.durability}
                        </Typography>
                        <Chip 
                          label={armor.severity} 
                          size="small" 
                          sx={{ 
                            bgcolor: armor.color, 
                            color: 'white',
                            fontSize: '0.7rem'
                          }} 
                        />
                      </Box>
                      <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.85rem' }}>
                        {armor.effect}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Paper>
            
        {/* Repair System */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#4CAF50', 0.1), 
            p: 2, 
            borderBottom: '3px solid #4CAF50'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#4CAF50' }}>
              🔨 Repair Mechanics
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {/* Repair Process */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: alpha('#4CAF50', 0.03),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#4CAF50', 0.3)}`
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#4CAF50' }} gutterBottom>
                  🛠️ Repair Process
                </Typography>
              
                <Stack spacing={1}>
                  <Box sx={{ p: 1.5, bgcolor: alpha('#4CAF50', 0.1), borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ fontSize: '0.85rem' }}>
                      Required Skills
                    </Typography>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>• Metalworking</Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>• Leatherworking</Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>• Crafting [General]</Typography>
                    </Stack>
                  </Box>

                  <Box sx={{ p: 1.5, bgcolor: alpha('#2196F3', 0.1), borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ fontSize: '0.85rem' }}>
                      Base Difficulty
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.8rem' }}>
                      Difficulty = Durability Lost
                    </Typography>
                  </Box>

                  <Box sx={{ p: 1.5, bgcolor: alpha('#FF9800', 0.1), borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ fontSize: '0.85rem' }}>
                      Base Time Required
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.8rem' }}>
                      1 hour per difficulty point
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
              
              {/* Repair Modifiers */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: alpha('#FF9800', 0.03),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#FF9800', 0.3)}`
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#FF9800' }} gutterBottom>
                  ⚠️ Repair Modifiers
                </Typography>
              
                <Stack spacing={1}>
                  {[
                    { 
                      condition: 'No Tools Available', 
                      modifier: '+1 Difficulty', 
                      color: '#f44336' 
                    },
                    { 
                      condition: 'Rush Job (Half Time)', 
                      modifier: '+1 Difficulty', 
                      color: '#f44336' 
                    }
                  ].map((modifier, index) => (
                    <Box 
                      key={index}
                      display="flex" 
                      justifyContent="space-between" 
                      alignItems="center" 
                      p={1.5} 
                      sx={{ 
                        bgcolor: alpha(modifier.color, 0.1), 
                        borderRadius: 1,
                        border: `1px solid ${alpha(modifier.color, 0.3)}`
                      }}
                    >
                      <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem' }}>
                        {modifier.condition}
                      </Typography>
                      <Chip 
                        label={modifier.modifier} 
                        size="small" 
                        sx={{ 
                          bgcolor: modifier.color, 
                          color: 'white', 
                          fontWeight: 'bold',
                          fontSize: '0.7rem'
                        }} 
                      />
                    </Box>
                  ))}
                </Stack>
              </Paper>
                
              {/* Cost Calculation */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: alpha('#9C27B0', 0.03),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#9C27B0', 0.3)}`
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#9C27B0' }} gutterBottom>
                  💰 Repair Cost Calculation
                </Typography>
              
                <Stack spacing={1}>
                  <Box sx={{ p: 1.5, bgcolor: alpha('#9C27B0', 0.1), borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ fontSize: '0.85rem' }}>
                      Base Cost Formula
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.8rem' }}>
                      20% × Original Value × Difficulty
                    </Typography>
                  </Box>

                  <Box sx={{ p: 1.5, bgcolor: alpha('#4CAF50', 0.1), borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ fontSize: '0.85rem' }}>
                      Cost Reduction
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.8rem' }}>
                      -10% per Advantage rolled
                    </Typography>
                  </Box>

                  <Box sx={{ p: 1.5, bgcolor: alpha('#2196F3', 0.1), borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ fontSize: '0.85rem' }}>
                      Final Step
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.8rem' }}>
                      Round down final price
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ mt: 2, p: 1.5, bgcolor: alpha('#9C27B0', 0.1), borderRadius: 1 }}>
                  <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ fontSize: '0.85rem' }}>
                    Example Calculation:
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                    <strong>100 credit sword, 3 durability lost, 2 advantages:</strong><br />
                    Base Cost: 20% × 100 × 3 = 60 credits<br />
                    Reduction: 60 - (2 × 10%) = 60 - 12 = 48 credits<br />
                    <strong>Final Cost: 48 credits</strong>
                  </Typography>
                </Box>
              </Paper>
            </Stack>
          </Box>
        </Paper>
              
        {/* Quick Reference */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            bgcolor: alpha('#FF9800', 0.05),
            border: '1px dashed #FF9800',
            borderRadius: 2
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h5">💡</Typography>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#FF9800' }}>
                Durability Quick Tips
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                • Durability lost = repair difficulty
                • No tools or rush jobs add +1 difficulty
                • Cost = 20% × value × difficulty, reduced by advantages
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Stack>
    </Box>,

    // Diseases
    <Box key="diseases" maxHeight="750px" overflow="auto" sx={{ p: 1 }}>
      {/* Header Section */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 2,
          background: 'linear-gradient(135deg, #8E24AA 0%, #6A1B9A 100%)',
          borderRadius: 2,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          🦠 Disease System
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Progressive ailments • Stage-based effects • Terminal conditions
        </Typography>
      </Paper>
      
      <Stack spacing={2}>
        {/* The Wretched Cycle */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#D32F2F', 0.1), 
            p: 2, 
            borderBottom: '3px solid #D32F2F'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#D32F2F' }}>
              🧟 The Wretched Cycle
            </Typography>
            <Typography variant="body2" sx={{ color: '#D32F2F', opacity: 0.8, fontSize: '0.85rem' }}>
              Potentially terminal • Humanity loss • Wretch transformation
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" fontWeight="medium" sx={{ mb: 2, fontSize: '0.85rem' }}>
              <strong>Transmission:</strong> Contact with Wretches • <strong>Effect:</strong> Progressive humanity loss and physical transformation
            </Typography>

            <Stack spacing={2}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#D32F2F' }}>
                Disease Progression
              </Typography>

              {[
                {
                  stage: 'Stage 1',
                  title: 'Mental Corruption',
                  effects: [
                    'Develop poison ivy-like rash and itching',
                    'Immediate Difficulty 4 Sanity check required',
                    'Failure: Gain permanent sanity level until cleansed'
                  ],
                  color: '#FF9800',
                  icon: '🧠',
                  severity: 'Mild'
                },
                {
                  stage: 'Stage 2', 
                  title: 'Physical Degradation',
                  effects: [
                    'Lose ability to speak clearly',
                    'Add 2 setback dice to all social checks',
                    'Treat Brawn and Agility as 1 lower'
                  ],
                  color: '#FF5722',
                  icon: '🗣️',
                  severity: 'Moderate'
                },
                {
                  stage: 'Stage 3',
                  title: 'Terminal Decay',
                  effects: [
                    'Cannot speak, rest, eat, or drink independently',
                    'Ooze corrosive brown sludge (5 damage to contact)',
                    'Resilience check: Difficulty 1 + previous successes',
                    'Check required immediately and every 24 hours',
                    'Failure: Transform into Wretch'
                  ],
                  color: '#D32F2F',
                  icon: '☠️',
                  severity: 'Terminal'
                }
              ].map((stage, index) => (
                <Paper 
                  key={index}
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    bgcolor: alpha(stage.color, 0.03),
                    borderRadius: 2,
                    border: `1px solid ${alpha(stage.color, 0.3)}`
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Typography variant="h4">{stage.icon}</Typography>
                    <Box sx={{ flex: 1 }}>
                      <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: stage.color }}>
                          {stage.stage}
                        </Typography>
                        <Chip 
                          label={stage.severity} 
                          size="small" 
                          sx={{ 
                            bgcolor: stage.color, 
                            color: 'white',
                            fontSize: '0.7rem'
                          }} 
                        />
                      </Box>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ fontSize: '0.9rem' }}>
                        {stage.title}
                      </Typography>
                    </Box>
                  </Box>
                  <Stack spacing={0.5} sx={{ pl: 1 }}>
                    {stage.effects.map((effect, effectIndex) => (
                      <Typography key={effectIndex} variant="body2" sx={{ fontSize: '0.8rem' }}>
                        • {effect}
                      </Typography>
                    ))}
                  </Stack>
                </Paper>
              ))}

              {/* Special Mechanics */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: alpha('#8E24AA', 0.03),
                  borderRadius: 2,
                  border: `1px solid ${alpha('#8E24AA', 0.3)}`
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#8E24AA' }} gutterBottom>
                  ⚠️ Special Wretched Cycle Mechanics
                </Typography>
                <Box sx={{ p: 1.5, bgcolor: alpha('#8E24AA', 0.1), borderRadius: 1 }}>
                  <Typography variant="body2" fontWeight="medium" gutterBottom sx={{ fontSize: '0.85rem' }}>
                    Stage 3 Overflow Rule:
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                    Receiving additional Wretched Cycle stages while at Stage 3 adds +1 difficulty 
                    to the next transformation resistance check.
                  </Typography>
                </Box>
              </Paper>
            </Stack>
          </Box>
        </Paper>
              
        {/* The Disease */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha('#1976D2', 0.1), 
            p: 2, 
            borderBottom: '3px solid #1976D2'
          }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1976D2' }}>
              🩸 The Disease
            </Typography>
            <Typography variant="body2" sx={{ color: '#1976D2', opacity: 0.8, fontSize: '0.85rem' }}>
              Hardest to treat • Blood clotting • Necrosis and hemorrhaging
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" fontWeight="medium" sx={{ mb: 2, fontSize: '0.85rem' }}>
              <strong>Transmission:</strong> Contaminated air inhalation • Contact with contaminated blood
            </Typography>

            <Stack spacing={2}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#1976D2' }}>
                Disease Progression
              </Typography>

              {[
                {
                  stage: 'Stage 1',
                  title: 'Asymptomatic',
                  effects: ['No visible symptoms', 'Disease present but dormant'],
                  color: '#4CAF50',
                  icon: '😐',
                  severity: 'Hidden'
                },
                {
                  stage: 'Stage 2',
                  title: 'Blood Vessel Restriction',
                  effects: [
                    'One limb begins to slow down',
                    'Blood clots restrict circulation',
                    'Gain critical injury rating 96'
                  ],
                  color: '#FF9800',
                  icon: '🦵',
                  severity: 'Noticeable'
                },
                {
                  stage: 'Stage 3',
                  title: 'Severe Compromise',
                  effects: [
                    'Blood vessels severely compromised',
                    'Begin bleeding from orifices',
                    'Lose free maneuver per turn',
                    'Action OR maneuver per turn only',
                    'Gain 1 unsoakable wound per action taken'
                  ],
                  color: '#FF5722',
                  icon: '🩸',
                  severity: 'Severe'
                },
                {
                  stage: 'Stage 4+',
                  title: 'Limb Necrosis',
                  effects: [
                    'Body can no longer maintain circulation',
                    'One limb becomes necrotic per stage',
                    'Cannot use necrotic limbs',
                    'Death if all 4 major limbs affected'
                  ],
                  color: '#D32F2F',
                  icon: '🦴',
                  severity: 'Terminal'
                }
              ].map((stage, index) => (
                <Paper 
                  key={index}
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    bgcolor: alpha(stage.color, 0.03),
                    borderRadius: 2,
                    border: `1px solid ${alpha(stage.color, 0.3)}`
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Typography variant="h4">{stage.icon}</Typography>
                    <Box sx={{ flex: 1 }}>
                      <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: stage.color }}>
                          {stage.stage}
                        </Typography>
                        <Chip 
                          label={stage.severity} 
                          size="small" 
                          sx={{ 
                            bgcolor: stage.color, 
                            color: 'white',
                            fontSize: '0.7rem'
                          }} 
                        />
                      </Box>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ fontSize: '0.9rem' }}>
                        {stage.title}
                      </Typography>
                    </Box>
                  </Box>
                  <Stack spacing={0.5} sx={{ pl: 1 }}>
                    {stage.effects.map((effect, effectIndex) => (
                      <Typography key={effectIndex} variant="body2" sx={{ fontSize: '0.8rem' }}>
                        • {effect}
                      </Typography>
                    ))}
                  </Stack>
                </Paper>
              ))}

              {/* Critical Information */}
              <Stack spacing={1}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    bgcolor: alpha('#FF5722', 0.03),
                    borderRadius: 2,
                    border: `1px solid ${alpha('#FF5722', 0.3)}`
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#FF5722' }} gutterBottom>
                    🦴 Stage 4+ Progression
                  </Typography>
                  <Box sx={{ p: 1.5, bgcolor: alpha('#FF5722', 0.1), borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="medium" gutterBottom sx={{ fontSize: '0.85rem' }}>
                      Limb Necrosis Order:
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      Each stage beyond 4 affects one additional major limb (arms and legs). 
                      Patient dies if all 4 major limbs become necrotic and another stage is gained.
                    </Typography>
                  </Box>
                </Paper>
                
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    bgcolor: alpha('#1976D2', 0.03),
                    borderRadius: 2,
                    border: `1px solid ${alpha('#1976D2', 0.3)}`
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#1976D2' }} gutterBottom>
                    💊 Treatment Difficulty
                  </Typography>
                  <Box sx={{ p: 1.5, bgcolor: alpha('#1976D2', 0.1), borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="medium" gutterBottom sx={{ fontSize: '0.85rem' }}>
                      Hardest Disease to Treat:
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      The Disease is specifically noted as the most difficult disease to treat 
                      within the Backrooms environment.
                    </Typography>
                  </Box>
                </Paper>
              </Stack>
            </Stack>
          </Box>
        </Paper>
                
        {/* Quick Reference */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            bgcolor: alpha('#8E24AA', 0.05),
            border: '1px dashed #8E24AA',
            borderRadius: 2
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h5">💡</Typography>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#8E24AA' }}>
                Disease Quick Tips
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                • Wretched Cycle: Contact transmission, progressive humanity loss
                • The Disease: Airborne/blood transmission, hardest to treat
                • Both diseases have terminal stages that can result in death
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Stack>
    </Box>
    ];

    return content[generalValue] || content[0];
  };

  const DisplayEffectTab = () => {
    const effectContent = [
      <Box key="lighting" maxHeight="750px" overflow="auto" sx={{ p: 1 }}>
        {/* Header Section */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 2, 
            mb: 2,
            background: 'linear-gradient(135deg, #FFC107 0%, #FF8F00 100%)',
            borderRadius: 2,
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            💡 Lighting & Concealment
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Light levels • Visibility modifiers • Stealth mechanics
          </Typography>
        </Paper>
        
        <Stack spacing={2}>
          {/* Light Level System */}
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ 
              bgcolor: alpha('#FFC107', 0.1), 
              p: 2, 
              borderBottom: '3px solid #FFC107'
            }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#FF8F00' }}>
                🌟 Light Level System
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    bgcolor: alpha('#FFC107', 0.03),
                    borderRadius: 2,
                    border: `1px solid ${alpha('#FFC107', 0.3)}`
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#FF8F00' }} gutterBottom>
                    📊 Light Level Scale (0-10)
                  </Typography>
                  <Stack spacing={1}>
                    {[
                      { range: '0-4', type: 'Dark', color: '#424242', icon: '🌑' },
                      { range: '5', type: 'Neutral', color: '#9E9E9E', icon: '🌗' },
                      { range: '6-10', type: 'Bright/Light', color: '#FFC107', icon: '☀️' }
                    ].map((light, index) => (
                      <Box 
                        key={index}
                        display="flex" 
                        alignItems="center" 
                        gap={2}
                        p={1.5} 
                        sx={{ 
                          bgcolor: alpha(light.color, 0.1), 
                          borderRadius: 1,
                          border: `1px solid ${alpha(light.color, 0.3)}`
                        }}
                      >
                        <Typography variant="h5">{light.icon}</Typography>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold" sx={{ color: light.color, fontSize: '0.9rem' }}>
                            Light Level {light.range}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{light.type}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
                  
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    bgcolor: alpha('#FFC107', 0.03),
                    borderRadius: 2,
                    border: `1px solid ${alpha('#FFC107', 0.3)}`
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#FF8F00' }} gutterBottom>
                    💡 Light Source Effects
                  </Typography>
                  <Box sx={{ p: 1.5, bgcolor: alpha('#FFC107', 0.1), borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="medium" gutterBottom sx={{ fontSize: '0.85rem' }}>
                      Area Replacement
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      Light sources replace the area's natural light level within their range
                    </Typography>
                  </Box>
                </Paper>
              </Stack>
            </Box>
          </Paper>
                
          {/* Concealment System */}
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ 
              bgcolor: alpha('#2196F3', 0.1), 
              p: 2, 
              borderBottom: '3px solid #2196F3'
            }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#2196F3' }}>
                👁️ Concealment Effects
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.85rem' }}>
                Concealment affects sight-based checks (penalties) and stealth checks (bonuses)
              </Typography>
          
              <Stack spacing={2}>
                {[
                  {
                    level: 'Level 1',
                    sources: ['Light to medium mist', 'Waist-high grass/foliage', 'Light levels 2 or 8'],
                    effect: '1 setback (sight) / 1 boost (stealth)',
                    color: '#4CAF50',
                    icon: '🌫️'
                  },
                  {
                    level: 'Level 2', 
                    sources: ['Light to medium fog', 'Shoulder-high grass/foliage', 'Light levels 1 or 9'],
                    effect: '2 setback (sight) / 2 boost (stealth)',
                    color: '#FF9800',
                    icon: '🌁'
                  },
                  {
                    level: 'Level 3',
                    sources: ['Heavy fog/thick smoke', 'Head-high grass/foliage', 'Light levels 0 or 10'],
                    effect: '3 setback (sight) / 3 boost (stealth)',
                    color: '#F44336',
                    icon: '🌊'
                  }
                ].map((concealment, index) => (
                  <Paper 
                    key={index}
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      bgcolor: alpha(concealment.color, 0.03),
                      borderRadius: 2,
                      border: `1px solid ${alpha(concealment.color, 0.3)}`
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      <Typography variant="h4">{concealment.icon}</Typography>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: concealment.color }}>
                          {concealment.level}
                        </Typography>
                        <Chip 
                          label={concealment.effect} 
                          size="small" 
                          sx={{ 
                            bgcolor: concealment.color, 
                            color: 'white',
                            fontSize: '0.7rem',
                            mt: 0.5
                          }} 
                        />
                      </Box>
                    </Box>
                    <Stack spacing={0.5} sx={{ pl: 1 }}>
                      <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.85rem', color: concealment.color }}>
                        Sources:
                      </Typography>
                      {concealment.sources.map((source, sourceIndex) => (
                        <Typography key={sourceIndex} variant="body2" sx={{ fontSize: '0.8rem' }}>
                          • {source}
                        </Typography>
                      ))}
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Box>
          </Paper>
              
          {/* Quick Reference */}
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              bgcolor: alpha('#FFC107', 0.05),
              border: '1px dashed #FFC107',
              borderRadius: 2
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h5">💡</Typography>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#FF8F00' }}>
                  Lighting Quick Tips
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  • Light levels 0-4 = Dark, 5 = Neutral, 6-10 = Bright
                  • Light sources replace area's natural light level
                  • Higher concealment = more sight penalties but better stealth bonuses
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Stack>
      </Box>,

      <Box key="exhaustion" maxHeight="750px" overflow="auto" sx={{ p: 1 }}>
        {/* Header Section */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 2, 
            mb: 2,
            background: 'linear-gradient(135deg, #FF5722 0%, #D84315 100%)',
            borderRadius: 2,
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            😴 Exhaustion System
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Fatigue accumulation • Progressive penalties • Survival mechanics
          </Typography>
        </Paper>
        
        <Stack spacing={2}>
          {/* Sources of Exhaustion */}
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ 
              bgcolor: alpha('#FF5722', 0.1), 
              p: 2, 
              borderBottom: '3px solid #FF5722'
            }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#FF5722' }}>
                ⚠️ Sources of Exhaustion
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Stack spacing={2}>
                {[
                  {
                    source: 'Extreme Temperature',
                    condition: '10 rounds in heat level 0 or 10 without protective gear',
                    icon: '🌡️',
                    color: '#FF9800'
                  },
                  {
                    source: 'Critical Damage',
                    condition: 'Choose exhaustion instead of critical injury/remark (after roll)',
                    icon: '💔',
                    color: '#F44336'
                  },
                  {
                    source: 'Sleep Deprivation',
                    condition: 'Difficulty 1 Resilience check after 24h without sleep (+1 difficulty each day)',
                    icon: '😴',
                    color: '#9C27B0'
                  },
                  {
                    source: 'Starvation',
                    condition: 'Difficulty 1 Resilience check after 24h without food (+1 difficulty each day)',
                    icon: '🍞',
                    color: '#795548'
                  },
                  {
                    source: 'Dehydration',
                    condition: 'Difficulty 1 Resilience check after 24h without water (+1 difficulty each day)',
                    icon: '💧',
                    color: '#2196F3',
                    note: 'Causes 2 levels on failure'
                  }
                ].map((source, index) => (
                  <Paper 
                    key={index}
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      bgcolor: alpha(source.color, 0.03),
                      borderRadius: 2,
                      border: `1px solid ${alpha(source.color, 0.3)}`
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      <Typography variant="h4">{source.icon}</Typography>
                      <Box sx={{ flex: 1 }}>
                        <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                          <Typography variant="subtitle2" fontWeight="bold" sx={{ color: source.color }}>
                            {source.source}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem', pl: 1 }}>
                      {source.condition}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Box>
          </Paper>
              
          {/* Exhaustion Effects */}
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ 
              bgcolor: alpha('#f44336', 0.1), 
              p: 2, 
              borderBottom: '3px solid #f44336'
            }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#f44336' }}>
                📉 Exhaustion Level Effects
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Stack spacing={1}>
                {[
                  { level: 1, effect: 'Add 2 setback dice to all physical checks', color: '#4CAF50', severity: 'Tired' },
                  { level: 2, effect: 'Maximum maneuvers per turn reduced to 1', color: '#8BC34A', severity: 'Fatigued' },
                  { level: 3, effect: 'Add 1 difficulty dice to all physical checks', color: '#FFC107', severity: 'Weary' },
                  { level: 4, effect: 'Wound threshold is halved', color: '#FF9800', severity: 'Drained' },
                  { level: 5, effect: 'Become immobilized', color: '#FF5722', severity: 'Collapsed' },
                  { level: '6+', effect: 'Death', color: '#D32F2F', severity: 'Fatal' }
                ].map((exhaustion, index) => (
                  <Paper 
                    key={index}
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      bgcolor: alpha(exhaustion.color, 0.03),
                      borderRadius: 2,
                      border: `1px solid ${alpha(exhaustion.color, 0.3)}`
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: 2, 
                          bgcolor: exhaustion.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}
                      >
                        {exhaustion.level}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                          <Typography variant="subtitle2" fontWeight="bold" sx={{ color: exhaustion.color }}>
                            Level {exhaustion.level}
                          </Typography>
                          <Chip 
                            label={exhaustion.severity} 
                            size="small" 
                            sx={{ 
                              bgcolor: exhaustion.color, 
                              color: 'white',
                              fontSize: '0.7rem'
                            }} 
                          />
                        </Box>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                          {exhaustion.effect}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </Box>
          </Paper>
              
          {/* Quick Reference */}
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              bgcolor: alpha('#FF5722', 0.05),
              border: '1px dashed #FF5722',
              borderRadius: 2
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h5">💡</Typography>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#FF5722' }}>
                  Exhaustion Quick Tips
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  • Level 6+ exhaustion = death
                  • Dehydration causes 2 levels on failure
                  • Physical checks become progressively harder
                  • Level 5 = immobilized (cannot move)
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Stack>
      </Box>,

      <Box key="fear" maxHeight="750px" overflow="auto" sx={{ p: 1 }}>
        {/* Header Section */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 2, 
            mb: 2,
            background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
            borderRadius: 2,
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            😱 Fear & Sanity System
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Terror responses • Mental degradation • Sanity mechanics
          </Typography>
        </Paper>
        
        <Stack spacing={2}>
          {/* Fear Mechanics */}
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ 
              bgcolor: alpha('#9C27B0', 0.1), 
              p: 2, 
              borderBottom: '3px solid #9C27B0'
            }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#9C27B0' }}>
                😰 Fear Check Results
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" sx={{ mb: 2, fontSize: '0.85rem' }}>
                <strong>Fear Rule:</strong> Uses Sanity skill • Cannot be triggered by same source twice • Encounters otherworldly terrors
              </Typography>
          
              <Stack spacing={2}>
                {/* Failure Results */}
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    bgcolor: alpha('#F44336', 0.03),
                    borderRadius: 2,
                    border: `1px solid ${alpha('#F44336', 0.3)}`
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#F44336' }} gutterBottom>
                    ❌ Failure Results
                  </Typography>
                  <Stack spacing={1}>
                    {[
                      { threats: '0-1', effect: 'Disoriented for rest of encounter', color: '#FF9800' },
                      { threats: '2-3', effect: 'Must spend next turn running from fear source', color: '#FF5722' },
                      { threats: '4+/Despair', effect: 'Immobilized and Staggered until end of next turn', color: '#D32F2F' }
                    ].map((failure, index) => (
                      <Box 
                        key={index}
                        display="flex" 
                        alignItems="center" 
                        gap={2}
                        p={1.5} 
                        sx={{ 
                          bgcolor: alpha(failure.color, 0.05),
                          borderRadius: 1,
                          border: `1px solid ${alpha(failure.color, 0.3)}`
                        }}
                      >
                        <Chip 
                          label={`${failure.threats} Threats`} 
                          size="small" 
                          sx={{ 
                            bgcolor: failure.color, 
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.7rem',
                            minWidth: 80
                          }} 
                        />
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                          {failure.effect}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
                  
                {/* Success Results */}
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    bgcolor: alpha('#4CAF50', 0.03),
                    borderRadius: 2,
                    border: `1px solid ${alpha('#4CAF50', 0.3)}`
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#4CAF50' }} gutterBottom>
                    ✅ Success Results
                  </Typography>
                  <Stack spacing={1}>
                    {[
                      { advantages: 'Any', effect: 'Boost next check + 3 strain damage', color: '#FF9800' },
                      { advantages: '0-1', effect: 'Keep your nerves', color: '#4CAF50' },
                      { advantages: '2-3', effect: 'Allies get boost dice vs same fear', color: '#2196F3' },
                      { advantages: '4+/Triumph', effect: 'Allies auto-pass vs same fear', color: '#9C27B0' }
                    ].map((success, index) => (
                      <Box 
                        key={index}
                        display="flex" 
                        alignItems="center" 
                        gap={2}
                        p={1.5} 
                        sx={{ 
                          bgcolor: alpha(success.color, 0.05),
                          borderRadius: 1,
                          border: `1px solid ${alpha(success.color, 0.3)}`
                        }}
                      >
                        <Chip 
                          label={`${success.advantages} Adv`} 
                          size="small" 
                          sx={{ 
                            bgcolor: success.color, 
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.7rem',
                            minWidth: 80
                          }} 
                        />
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                          {success.effect}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
                  
                {/* Extreme Results */}
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    bgcolor: alpha('#2196F3', 0.03),
                    borderRadius: 2,
                    border: `1px solid ${alpha('#2196F3', 0.3)}`
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#2196F3' }} gutterBottom>
                    🌟 Extreme Results
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ p: 1.5, bgcolor: alpha('#D32F2F', 0.1), borderRadius: 1 }}>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: '#D32F2F', fontSize: '0.85rem' }} gutterBottom>
                        Extreme Failure
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                        5 threats / 2 despairs / 3 threats + despair<br />
                        <strong>Effect:</strong> Gain sanity levels = fear difficulty
                      </Typography>
                    </Box>
                    <Box sx={{ p: 1.5, bgcolor: alpha('#4CAF50', 0.1), borderRadius: 1 }}>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: '#4CAF50', fontSize: '0.85rem' }} gutterBottom>
                        Extreme Success
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                        5 advantages / 2 triumphs / 3 advantages + triumph<br />
                        <strong>Effect:</strong> Remove 1 sanity level
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Stack>
            </Box>
          </Paper>
                
          {/* Sanity Effects */}
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ 
              bgcolor: alpha('#f44336', 0.1), 
              p: 2, 
              borderBottom: '3px solid #f44336'
            }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#f44336' }}>
                🧠 Sanity Level Effects (Cumulative)
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.85rem' }}>
                Each level includes all effects from previous levels
              </Typography>
          
              <Stack spacing={1}>
                {[
                  { level: 1, effect: 'Setback dice to all social skills', color: '#FFC107', category: 'Social' },
                  { level: 2, effect: 'Nothing', color: '#E0E0E0', category: 'None' },
                  { level: 3, effect: 'Difficulty dice to all social skills', color: '#FF9800', category: 'Social' },
                  { level: 4, effect: 'Nothing', color: '#E0E0E0', category: 'None' },
                  { level: 5, effect: 'Setback dice to all non-social skills', color: '#FF5722', category: 'General' },
                  { level: 6, effect: 'Nothing', color: '#E0E0E0', category: 'None' },
                  { level: 7, effect: 'Difficulty dice to all non-social skills', color: '#F44336', category: 'General' },
                  { level: 8, effect: 'Receive +1 strain damage whenever taking strain', color: '#D32F2F', category: 'Strain' },
                  { level: 9, effect: 'Strain threshold is halved', color: '#B71C1C', category: 'Strain' },
                  { level: '10+', effect: 'Treat all skills as tier 0', color: '#000000', category: 'Catastrophic' }
                ].map((sanity, index) => (
                  <Paper 
                    key={index}
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      bgcolor: alpha(sanity.color, 0.03),
                      borderRadius: 2,
                      border: `1px solid ${alpha(sanity.color, 0.3)}`
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: 1, 
                          bgcolor: sanity.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: sanity.color === '#E0E0E0' ? '#000' : 'white',
                          fontWeight: 'bold',
                          fontSize: '0.85rem',
                          flexShrink: 0
                        }}
                      >
                        {sanity.level}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box display="flex" alignItems="center" gap={2} mb={0.5}>
                          <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.9rem' }}>
                            Level {sanity.level}
                          </Typography>
                          <Chip 
                            label={sanity.category} 
                            size="small" 
                            sx={{ 
                              bgcolor: sanity.color, 
                              color: sanity.color === '#E0E0E0' ? '#000' : 'white',
                              fontSize: '0.7rem'
                            }} 
                          />
                        </Box>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                          {sanity.effect}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </Box>
          </Paper>
              
          {/* Quick Reference */}
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              bgcolor: alpha('#9C27B0', 0.05),
              border: '1px dashed #9C27B0',
              borderRadius: 2
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h5">💡</Typography>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#9C27B0' }}>
                  Fear & Sanity Quick Tips
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  • Fear uses Sanity skill, can't be triggered twice by same source
                  • Extreme failure = gain sanity levels equal to fear difficulty
                  • Sanity effects are cumulative (each level includes previous effects)
                  • Level 10+ = all skills become tier 0 (catastrophic)
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Stack>
      </Box>,

      <Box key="resting" maxHeight="750px" overflow="auto">
        <Stack spacing={2}>
          {/* Main Header */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2,
              background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
              borderRadius: 2,
              color: 'white',
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Rest & Recovery System
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Danger-based rest limits • Healing mechanics • Recovery bonuses
            </Typography>
          </Paper>
          
          {/* Rest Duration by Danger Level */}
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#2196F3', mb: 2, textAlign: 'center' }}>
              Rest Duration by Danger Level
            </Typography>
            <Typography variant="caption" display="block" sx={{ textAlign: 'center', mb: 2, color: 'text.secondary' }}>
              <strong>Overtime Warning:</strong> Resting beyond the time limit significantly increases threat appearance chances
            </Typography>
            
            <Grid container spacing={2}>
              {[
                { danger: 0, time: 'Unlimited', description: 'Safe areas', color: '#4CAF50', icon: '🏠' },
                { danger: 1, time: '72 hours', description: 'Low threat', color: '#8BC34A', icon: '🛡️' },
                { danger: 2, time: '24 hours', description: 'Moderate threat', color: '#FFC107', icon: '⚠️' },
                { danger: 3, time: '3 hours', description: 'High threat', color: '#FF9800', icon: '🚨' },
                { danger: '4-5', time: 'No rest', description: 'Extreme danger', color: '#F44336', icon: '💀' }
              ].map((rest, index) => (
                <Grid item xs={6} sm={4} md={2.4} key={index}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 2,
                      borderRadius: 2,
                      border: `2px solid ${rest.color}`,
                      textAlign: 'center',
                      height: '140px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Box>
                      <Typography variant="h4" sx={{ mb: 1 }}>{rest.icon}</Typography>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: rest.color }}>
                        DANGER {rest.danger}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Box sx={{ 
                        bgcolor: rest.color, 
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        mb: 0.5
                      }}>
                        {rest.time}
                      </Box>
                      <Typography variant="caption">
                        {rest.description}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
            
          {/* Rest Healing Effects */}
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#4CAF50', mb: 2, textAlign: 'center' }}>
              Rest Healing Effects
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {[
                {
                  duration: 'Per Hour',
                  healing: '1 wound + 2 strain',
                  icon: '⏰',
                  color: '#4CAF50'
                },
                {
                  duration: '8 Hours (Sleep)',
                  healing: '+5 wounds, +10 strain, -1 exhaustion',
                  icon: '😴',
                  color: '#2196F3'
                },
                {
                  duration: '24 Hours',
                  healing: '-2 sanity, remove all exhaustion',
                  icon: '📅',
                  color: '#9C27B0'
                },
                {
                  duration: '1 Week (168h)',
                  healing: 'Full recovery + critical injury check',
                  icon: '🏥',
                  color: '#FF9800'
                }
              ].map((effect, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 2,
                      borderRadius: 2,
                      border: `2px solid ${effect.color}`,
                      textAlign: 'center',
                      height: '140px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Box>
                      <Typography variant="h4" sx={{ mb: 1 }}>{effect.icon}</Typography>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: effect.color }}>
                        {effect.duration.toUpperCase()}
                      </Typography>
                    </Box>
                    
                    <Typography variant="caption" sx={{ lineHeight: 1.2 }}>
                      {effect.healing}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            
            {/* Week Recovery Details */}
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2,
                borderRadius: 2,
                border: `2px solid #FF9800`,
                bgcolor: alpha('#FF9800', 0.05)
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#FF9800', mb: 1 }}>
                ONE WEEK RECOVERY DETAILS
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Complete healing of all wounds, strain, exhaustion, and sanity. Make Resilience check against critical injuries:
              </Typography>
              <Box sx={{ p: 1, bgcolor: alpha('#FF9800', 0.1), borderRadius: 1 }}>
                <Typography variant="caption">
                  • <strong>Success:</strong> Remove one critical injury<br />
                  • <strong>Triumph/5 Advantages:</strong> Remove next lowest severity critical injury as well
                </Typography>
              </Box>
            </Paper>
          </Box>
            
          {/* 24-Hour Rest Bonuses */}
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#9C27B0', mb: 2, textAlign: 'center' }}>
              24-Hour Rest Bonuses (Choose Up to 2)
            </Typography>
            
            <Grid container spacing={2}>
              {[
                {
                  bonus: '1',
                  name: 'Temporary Wounds',
                  effect: 'Gain 5 temporary wounds (damage reduction)',
                  icon: '❤️',
                  color: '#F44336'
                },
                {
                  bonus: '2', 
                  name: 'Temporary Strain',
                  effect: 'Gain 5 temporary strain (strain reduction)',
                  icon: '🧠',
                  color: '#9C27B0'
                },
                {
                  bonus: '3',
                  name: 'Enhanced Performance',
                  effect: '2 boost dice to all checks for 8 hours (stacks to 4)',
                  icon: '⚡',
                  color: '#FFC107'
                },
                {
                  bonus: '4',
                  name: 'Efficient Movement',
                  effect: 'No strain cost for second maneuver (24 hours)',
                  icon: '🏃',
                  color: '#4CAF50'
                },
                {
                  bonus: '5',
                  name: 'Resilient Mind',
                  effect: 'Ignore next sanity/exhaustion/critical injury (24 hours)',
                  icon: '🛡️',
                  color: '#2196F3'
                }
              ].map((bonus, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 2,
                      borderRadius: 2,
                      border: `2px solid ${bonus.color}`,
                      height: '140px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: 1, 
                          bgcolor: bonus.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}
                      >
                        {bonus.bonus}
                      </Box>
                      <Typography variant="h5">{bonus.icon}</Typography>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: bonus.color, fontSize: '0.85rem' }}>
                        {bonus.name.toUpperCase()}
                      </Typography>
                    </Box>
                      
                    <Typography variant="caption" sx={{ lineHeight: 1.2 }}>
                      {bonus.effect}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Stack>
      </Box>,

      <Box key="atmosphere" maxHeight="750px" overflow="auto">
        <Stack spacing={2}>
          {/* Main Header */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2,
              background: 'linear-gradient(135deg, #607D8B 0%, #455A64 100%)',
              borderRadius: 2,
              color: 'white',
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Atmospheric Hazards
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Toxic atmospheres • Temperature extremes • Environmental dangers
            </Typography>
          </Paper>
          
          {/* Corrosive/Toxic System Overview */}
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#4CAF50', mb: 2, textAlign: 'center' }}>
              Corrosive/Toxic Atmosphere System
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center', mb: 2, color: 'text.secondary' }}>
              <strong>Resilience Check:</strong> Beginning of each turn • Difficulty = ½ rating (rounded up) • Holding breath negates effects
            </Typography>

            {/* Base Effect */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2,
                    borderRadius: 2,
                    border: `2px solid #FF5722`,
                    textAlign: 'center',
                    height: '100px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
                    <Typography variant="h4">💀</Typography>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#FF5722' }}>
                        BASE EFFECT
                      </Typography>
                      <Typography variant="body2">
                        Wound damage = Atmosphere rating
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
                
            {/* Atmosphere Rating Effects */}
            <Typography variant="subtitle1" fontWeight="bold" sx={{ textAlign: 'center', mb: 2 }}>
              Additional Effects by Rating
            </Typography>
            <Grid container spacing={2}>
              {[
                { rating: '1-2', effect: 'No additional effects', color: '#4CAF50', icon: '✅' },
                { rating: '3-4', effect: 'Receive 1 strain damage', color: '#8BC34A', icon: '😷' },
                { rating: '5-6', effect: 'Receive 3 strain damage', color: '#FFC107', icon: '🤢' },
                { rating: '7-8', effect: 'Receive 5 strain damage', color: '#FF9800', icon: '🤮' },
                { rating: '9-10', effect: 'Receive a critical injury', color: '#F44336', icon: '☠️' }
              ].map((atmo, index) => (
                <Grid item xs={6} sm={4} md={2.4} key={index}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 1.5,
                      borderRadius: 2,
                      border: `2px solid ${atmo.color}`,
                      textAlign: 'center',
                      height: '120px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Box>
                      <Typography variant="h4" sx={{ mb: 0.5 }}>{atmo.icon}</Typography>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: atmo.color }}>
                        RATING {atmo.rating}
                      </Typography>
                    </Box>

                    <Typography variant="caption" sx={{ lineHeight: 1.2 }}>
                      {atmo.effect}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
            
          {/* Temperature Hazards */}
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#FF9800', mb: 2, textAlign: 'center' }}>
              Temperature Hazards (Heat Levels 0-10)
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {/* Extreme Cold */}
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2,
                    borderRadius: 2,
                    border: `2px solid #2196F3`,
                    height: '180px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h3">🧊</Typography>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                        EXTREME COLD
                      </Typography>
                      <Box sx={{ 
                        bgcolor: '#2196F3', 
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        display: 'inline-block'
                      }}>
                        Heat Level 0-1
                      </Box>
                    </Box>
                  </Box>
                    
                  <Stack spacing={0.5}>
                    <Typography variant="caption">• All movement becomes difficult terrain</Typography>
                    <Typography variant="caption">• Add 1 difficulty to all physical checks</Typography>
                    <Typography variant="caption">• Body begins to slow down</Typography>
                  </Stack>
                </Paper>
              </Grid>
                    
              {/* Extreme Heat */}
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2,
                    borderRadius: 2,
                    border: `2px solid #F44336`,
                    height: '180px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h3">🔥</Typography>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#F44336' }}>
                        EXTREME HEAT
                      </Typography>
                      <Box sx={{ 
                        bgcolor: '#F44336', 
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        display: 'inline-block'
                      }}>
                        Heat Level 9-10
                      </Box>
                    </Box>
                  </Box>
                    
                  <Stack spacing={0.5}>
                    <Typography variant="caption">• Each maneuver deals 1 strain damage</Typography>
                    <Typography variant="caption">• Pushing yourself in unbearable heat</Typography>
                    <Typography variant="caption">• Rapid exhaustion from exertion</Typography>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
                    
            {/* Equipment Protection */}
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2,
                borderRadius: 2,
                border: `2px solid #4CAF50`,
                bgcolor: alpha('#4CAF50', 0.05),
                textAlign: 'center'
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
                <Typography variant="h5">🛡️</Typography>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" color="#4CAF50">
                    EQUIPMENT PROTECTION
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Appropriate protective gear completely negates temperature effects
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Stack>
      </Box>,

      <Box key="actions" maxHeight="750px" overflow="auto">
        <Stack spacing={2}>
          {/* Main Header */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              color: 'white',
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Turn Structure
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              What you can do each turn in combat and encounters
            </Typography>
          </Paper>
          
          {/* Actions Section */}
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#4CAF50', mb: 2, textAlign: 'center' }}>
              One Action Per Turn
            </Typography>
            <Grid container spacing={2}>
              {[
                { icon: '⚔️', title: 'Use a maneuver', desc: 'Perform tactical movement' },
                { icon: '⚡', title: 'Activate an ability', desc: 'Use special powers or talents' },
                { icon: '🎯', title: 'Perform a skill check', desc: 'Use your expertise' },
                { icon: '🗡️', title: 'Perform a combat check', desc: 'Attack or defend' }
              ].map((action, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 2,
                      borderRadius: 2,
                      border: `2px solid #4CAF50`,
                      textAlign: 'center',
                      height: '140px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Box>
                      <Typography variant="h4" sx={{ mb: 1 }}>{action.icon}</Typography>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                        {action.title.toUpperCase()}
                      </Typography>
                    </Box>

                    <Typography variant="caption" sx={{ lineHeight: 1.2 }}>
                      {action.desc}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
            
          {/* Maneuvers Section */}
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#2196F3', mb: 2, textAlign: 'center' }}>
              Two Maneuvers Per Turn
            </Typography>
            <Typography variant="caption" display="block" sx={{ textAlign: 'center', mb: 2, color: 'text.secondary' }}>
              Tactical options and positioning (Page 98-100)
            </Typography>
            <Grid container spacing={1.5}>
              {[
                { icon: '🎯', name: 'Aim' },
                { icon: '🤝', name: 'Assist' },
                { icon: '🛡️', name: 'Guarded Stance' },
                { icon: '🔧', name: 'Interact with Environment' },
                { icon: '🎒', name: 'Manage Gear' },
                { icon: '🐎', name: 'Mount or Dismount' },
                { icon: '🏃', name: 'Move' },
                { icon: '🤲', name: 'Drop prone or Stand from prone' },
                { icon: '⏳', name: 'Preparation' },
                { icon: '✨', name: 'Other non-check actions' }
              ].map((maneuver, index) => (
                <Grid item xs={6} sm={4} md={2.4} key={index}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 1.5,
                      borderRadius: 2,
                      border: `2px solid #2196F3`,
                      textAlign: 'center',
                      height: '80px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant="h5" sx={{ mb: 0.5 }}>{maneuver.icon}</Typography>
                    <Typography variant="caption" fontWeight="bold" sx={{ 
                      color: '#2196F3',
                      lineHeight: 1.1,
                      textAlign: 'center'
                    }}>
                      {maneuver.name}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
            
          {/* Incidentals Section */}
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#FF9800', mb: 2, textAlign: 'center' }}>
              Three Incidentals Per Turn
            </Typography>
            <Typography variant="caption" display="block" sx={{ textAlign: 'center', mb: 2, color: 'text.secondary' }}>
              Quick, minor actions that don't require much effort
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {[
                { icon: '💬', text: 'Speak to another character', type: 'Communication' },
                { icon: '📦', text: 'Drop a held item or object', type: 'Item Management' },
                { icon: '👀', text: 'Minor movements like looking behind you or peeking around a corner', type: 'Awareness' },
                { icon: '⚡', text: 'Another action that takes very little time or has no measurable impact', type: 'Miscellaneous' }
              ].map((incidental, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 2,
                      borderRadius: 2,
                      border: `2px solid #FF9800`,
                      height: '120px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography variant="h4">{incidental.icon}</Typography>
                      <Box sx={{ 
                        bgcolor: alpha('#FF9800', 0.1), 
                        color: '#F57C00',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}>
                        {incidental.type}
                      </Box>
                    </Box>
                    
                    <Typography variant="caption" sx={{ lineHeight: 1.2 }}>
                      {incidental.text}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            
            {/* Special Rule */}
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2,
                borderRadius: 2,
                border: `2px dashed #FF5722`,
                bgcolor: alpha('#FF5722', 0.05),
                textAlign: 'center'
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="center" gap={2} sx={{ mb: 1 }}>
                <Typography variant="h5">⚠️</Typography>
                <Typography variant="subtitle2" fontWeight="bold" color="#FF5722">
                  OUTSIDE YOUR TURN
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                You may perform <strong>1 incidental</strong> from the above list during other players' turns
              </Typography>
            </Paper>
          </Box>
        </Stack>
      </Box>
    ];

    return effectContent[effectValue] || effectContent[0];
  };
                      

  const DisplayLethalTab = () => {
    const lethalContent = [
      // General Rulings
      <Box key="general" maxHeight="750px" overflow="auto">
        <Typography>1. You may use your scanner as an incidental on your turn</Typography>
        <Typography>2. Previously explored rooms are traversed at double the speed</Typography>
        <Typography>3. Should you die, you may remove 1 critical injury at random. Sometimes the injury is chosen if it makes sense</Typography>
        <Typography>4. All rooms except for the factory, locker, and Storage rooms are considered medium distance from door to door. These are considered long.</Typography>
        <Typography>5. You no longer receive 20 xp per session. Instead, you receive 10 xp per day completed.</Typography>
      </Box>,

      // Weight and Objects
      <Box key="weight" maxHeight="750px" overflow="auto">
        <Typography>Your Encumbrance is 20 times your brawn plus 10</Typography>
        <Typography>For every 20 weight over, receive 1 setback dice to all agility and brawn based checks</Typography>
        <Typography>While encumbered past your threshold plus 20 times your brawn, you lose your free maneuver per turn.</Typography>
        <Typography>While holding a 2-handed object, your action may be spent on a maneuver only.</Typography>
      </Box>,

      // Weather
      <Box key="weather" maxHeight="750px" overflow="auto">
        <Typography><strong>Clear:</strong> No Effect</Typography>
        <Typography><strong>Rainy:</strong> Every turn, there is a 1/6 chance you walk into a puddle. A difficulty 2 athletics or coordination check is then made. On a fail, you sink further in and must repeat the save again at 1 higher difficulty. After 3 fails, you die</Typography>
        <Typography><strong>Stormy:</strong> Every turn, there is a x/4 chance of lightning striking you where x is the amount of conductive items in your inventory. The difficulty is set at 1 + x</Typography>
        <Typography><strong>Foggy:</strong> Every turn, the fog shifts in or out and makes seeing harder or easier. The difficulty is based on the fog level</Typography>
        <Typography><strong>Flooded:</strong> The planet slowly floods. This value is kept hidden.</Typography>
        <Typography><strong>Eclipsed:</strong> An extra, unknown, amount of entities begin spawned within the facility. Also, night entities begin spawning immediately.</Typography>
      </Box>,

      // Ship
      <Box key="ship" maxHeight="750px" overflow="auto">
        <Typography>The ship door may be opened or closed, but it can only remain closed for so long.</Typography>
        <Typography>While the door is open, the atmosphere may enter into the ship. After the door is closed, it takes 1 extra round for it to be filtered out.</Typography>
        <Typography>Once the ship door is closed, it spends 1 power per round. The door has 6 power.</Typography>
        <Typography>While the door is open, each round it regains 2 power.</Typography>
        <br />
        <Divider>Actions</Divider>
        <Typography><strong>Scan Room:</strong> You may view a room adjacent to a player, whether it has a direct entrance or not. Movement will not be observed using this method.</Typography>
        <Typography><strong>Seek Entity:</strong> You may determine if an Entity is within two rooms of a player. This does not work diagonally.</Typography>
        <Typography><strong>Activate Teleporter:</strong> You may use either teleporter. This may be used as an out-of-turn incidental.</Typography>
        <Typography><strong>Access system:</strong> You may make an Access Systems check to gain access to a trap within the facility. The difficulty varies based on the trap. This uses the Computers skill and initiates a hacking encounter.</Typography>
        <Typography><strong>Override Security Program:</strong> You may make a difficulty 2 Computers check to override a security program within the system after succeeding on an Access System action. You must get at least as many successes as the program's strength to succeed. Failure may result in some negative effect.</Typography>
        <Typography><strong>Repair system:</strong> You may make a repair check to any system of component of the ship.</Typography>
        <br />
        <Divider>Maneuvers</Divider>
        <Typography><strong>Toggle Trap [NOT USED. ARCHIVE.]</strong> You may activate or deactivate any trap within the facility. A maximum of 3 may be activated at once. One must be re-enabled before disabling a 4th.</Typography>
        <Typography><strong>Send Message:</strong> You may send a message no more than 10 characters long to all players.</Typography>
        <Typography><strong>Planetary Scan:</strong> You may scan the outdoors as though it were a normal scanner.</Typography>
        <Typography><strong>Enact Command:</strong> While you have access to a system, you may cause the system to do a command, so long as you have access to that part of the system.</Typography>
        <Typography><strong>Activate Programs:</strong> You may activate some kind of security program. As a hacker, this can be done to introduce an unknown roadblock for the defender.</Typography>
        <br />
        <Divider>Incidentals</Divider>
        <Typography><strong>Check Time:</strong> You may move outside to check the time. If crouching, this will take two Incidentals.</Typography>
        <Typography><strong>Use Walkie-Talkie:</strong> Out-of-turn, you may use the Walkie Talkie to assist a player in a non-physical skill check. The difficulty of the check is reduced by 1 and both you and the player make the check. If either one passes, the check is considered passed.</Typography>
        <Typography><strong>Operate Ship Door:</strong> You may open or close the ship door.</Typography>
      </Box>,

      // Death
      <Box key="death" maxHeight="750px" overflow="auto">
        <Divider>Alterations</Divider>
        <Typography>You may carry a single one-handed item with a weight less than or equal to 30. If you have Bulked Load, you may carry a two-handed item and the weight maximum becomes 40.</Typography>
        <Typography>You may use either an Action or a Maneuver each turn, instead of both. Strain may not be used to perform an extra Maneuver.</Typography>
        <Typography>You may not speak or use any items such as Walkie-Talkies and Flashlights.</Typography>
        <Typography>You can not be seen or heard by players who are alive, but can see any items you are carrying.</Typography>
        <br />
        <Divider>Actions</Divider>
        <Typography><strong>Possess:</strong> You may attempt to possess an entity by rolling a Coercion check. The difficulty is based on the health of the entity. With no wounds, the difficulty is 5. At half or lower, the difficulty is 4. At over half, the difficulty is 3. While you are possessing an entity, you may use its free maneuver each turn. Also, the entity may not spend strain on a maneuver</Typography>
        <Typography><strong>Assist:</strong> You may prepare to assist a player with a physical skill check. The difficulty is reduced by 1 for that player. You may also make this skill check but at 1 difficulty higher instead of 1 lower. If either succeeds, the check is considered passed.</Typography>
        <br />
        <Divider>Incidentals</Divider>
        <Typography><strong>Flicker:</strong> Out-of-turn you may cause a flashlight to flicker to alert a player of danger. The player gains two boost dice to the next check that player makes.</Typography>
      </Box>,

      // Lighting
      <Box key="lighting" maxHeight="750px" overflow="auto">
        <Typography>Flashlights have a power of 4 and last for 13 rounds</Typography>
        <Typography>Pro-Flashlights have a power of 7 and last for 28 rounds</Typography>
        <Typography>Flashlights lose power if on at the beginning of your turn. You may spend a maneuver to turn it off before the power is lost</Typography>
      </Box>,

      // Homebrew
      <Box key="homebrew" maxHeight="750px" overflow="auto">
        <Divider>Items</Divider>
        <Typography><strong>Painkillers:</strong> Costs 200 credits to buy. Weight 5. Has 5 uses. </Typography>
        <Typography><strong>Medkits:</strong> Costs 50 credits to buy. Weight 12. Has 5 uses.</Typography>
        <Typography><strong>20 Experience Points:</strong> Costs 1000 credits to buy.</Typography>
        <Typography><strong>Flare:</strong> Costs 110 credits to buy. Weight 3. Has 1 use. It may be used to prevent all navigation checks on the current planet to be higher than two difficulty.</Typography>
        <Typography><strong>Signal Upgrader:</strong> Costs 400 credits to buy. Upgrades the Signal Translator to allow for 30 characters instead of 10 and the message is sent instantly.</Typography>
        <Typography><strong>Teleporter Upgrade:</strong> Costs 1400 credits to buy. Upgrades the teleporter to become instant and items are not dropped upon teleport.</Typography>
        <Typography><strong>Brass Knuckles:</strong> Costs 150 credits to buy.</Typography>
        <Typography><strong>Shotgun Shell:</strong> Costs 25 credits to buy. Weight 0. May stack 2 per inventory slot.</Typography>
        <Typography><strong>Revolver Bullet:</strong> Costs 15 credits to buy. Weight 0. May stack 6 per inventory slot.</Typography>
        <Typography><strong>Assault Rifle Clip (30):</strong> Costs 300 credits to buy. Weight 5.</Typography>
        <Typography><strong>Assault Rifle:</strong> Costs 800 credits to buy.</Typography>
        <Typography><strong>Revolver:</strong> Costs 400 credits to buy.</Typography>
        <br />
        <Divider>Talents</Divider>
        <Typography><strong>Stronger Scanner:</strong> Tier: 1. Activation: Passive. Add a boost dice to scans.</Typography>
        <Typography><strong>Stronger Scanner II:</strong> Tier: 2. Activation: Passive. Requirement: Stronger Scanner. Upgrade one ability dice for scans. If no ability dice can be upgraded, add one to the dice pool.</Typography>
        <Typography><strong>Stronger Scanner III:</strong> Tier: 3. Activation: Passive. Requirement: Stronger Scanner II. All obstacles are now ignored by the scanner. All adjacent rooms with an open door are scanned as well.</Typography>
        <Typography><strong>Bulked-Load:</strong> Tier: 2. Activation: Passive. Requirement: 4 or higher Brawn. You may carry an extra 2-handed item.</Typography>
        <Typography><strong>Expanded Inventory:</strong> Tier: 5. Activation: Passive. Ranked: Yes. You may now carry an additional item in your inventory. You may not exceed 8 slots.</Typography>
      </Box>,

      // Suit Effects
      <Box key="suits" maxHeight="750px" overflow="auto">
        <Typography>When buying a suit, you receive a singular suit rather than for the entire group.</Typography>
        <Typography>Suits may be swapped between while in orbit at will.</Typography>
        <Typography>Suits that have a choice of effect may be swapped while in orbit at will.</Typography>
        <br />
        <Divider>Suit Effects</Divider>
        <br />
        <Typography><strong>Decoy:</strong> Soak: 1. Defense: 0.</Typography>
        <Typography><strong>Brown:</strong> Soak: 0. Defense: 1.</Typography>
        <Typography><strong>Green:</strong> Soak: 2. Defense: 0. You add two boost dice to all stealth checks.</Typography>
        <Typography><strong>Purple:</strong> Soak: 0. Defense: 2.</Typography>
        <Typography><strong>Hazard:</strong> Soak: 3. Defense: 0. You add two setback dice to all stealth checks.</Typography>
        <Typography><strong>Bee:</strong> Soak: 1. Defense: 0. You do not take any damage from bees. You add two boost dice to attacks made against the Bunker Spider, Hoarding Bug, Snare Flea, and Spore Lizard.</Typography>
        <Typography><strong>Bunny:</strong></Typography>
        <Typography>Option 1: Soak: 1. Defense: 2.</Typography>
        <Typography>Option 2: Soak: 0. Defense: 0. You gain an extra free maneuver per turn. You may now take 3 maneuvers per turn.</Typography>
        <Typography><strong>Pajama:</strong></Typography>
        <Typography>Option 1: Soak: 0. Defense: 0. You gain an extra action per turn and you may ignore the strain costs spent on maneuvers 3 times per day.</Typography>
        <Typography>Option 2: Soak: 0. Defense: 3.</Typography>
        <Typography>Option 3: Soak: 2. Defense: 2.</Typography>
      </Box>,

      // Additional Rules
      <Box key="additional" maxHeight="750px" overflow="auto">
        <Typography>Some additional rules, taken from the above rules and altered slightly, are as follows:</Typography>
        <Typography>1. Hacking system is added to the ship actions.</Typography>
        <Typography>2. Sanity is added. Every 8 rounds, or 2 hours, a sanity roll is made.</Typography>
        <Typography>3. Fear is added. Each entity will have a fear rating and will be enacted on when encountering the entity.</Typography>
        <Typography>4. Exhaustion, specifically the portion about healing it and gaining a level in exchange for a critical injury.</Typography>
        <Typography>5. Durability for weapons and armor. The weapon durability effects are described in "General Rules" under "Durability and Repairs".</Typography>
        <br />
        <Divider>System structures</Divider>
        <Typography>Normally, the structure is kept hidden but due to this being testing material, the structure is shown for all.</Typography>
        <br />
        <Typography>A door trap has a difficulty of 1 to access the system. The door has no security programs.</Typography>
        <Typography>A landmine trap has a difficulty of 2 to access the system. The landmine has a Firewall defending shutdown.</Typography>
        <Typography>A spike trap has a difficulty of 4 to access the system. The spike trap has a Firewall defending shutdown and a Sentry defending sensors. Shutdown is only accessible when Sensors has been overridden.</Typography>
        <Typography>A turret has a difficulty of 4 to access the system. The turret has a Firewall defending shutdown, a Sentry defending sensors, and a Gate defending the firing section. Shutdown is only accessible when Sensors and Firing has been overridden.</Typography>
        <br />
        <Divider>Armor Durability</Divider>
        <br />
        <Typography>Suits may be broken down through enemy triumphs or own despairs. Suits have a durability of 3.</Typography>
        <Typography>The effects are as follows:</Typography>
        <Typography>3: No effects</Typography>
        <Typography>2: Your suit cracks or rips slightly. This allows the potentially toxic atmosphere to get into your suit. It however is not broken enough to cause loss of breath</Typography>
        <Typography>1: Your suit is too broken to absorb damage. Your suit loses its soak.</Typography>
        <Typography>0: The suit is unusable. Your suit loses its defense and you become unable to breathe while outside or in a room with outside atmosphere in it</Typography>
      </Box>,

      // Weapon Statistics
      <Box key="weapons" maxHeight="750px" overflow="auto">
        <Typography><strong>Shotgun:</strong> Ranged; Damage 10; Critical 3; Range [Short]</Typography>
        <Typography><strong>Shovel:</strong> Melee; Damage +4; Critical 3; Range [Engaged]; Cumbersome 3; Pierce 2; Vicious 1. Weight is 16.</Typography>
        <Typography><strong>Sign:</strong> Melee; Damage +4; Critical 2; Range [Engaged]; Defensive 1; Pierce 1; Unwieldy 3. Weight is 14.</Typography>
        <Typography><strong>Brass Knuckles:</strong> Brawl; Damage +1; Critical 4; Range [Engaged]; Disorient 3; Flurry 2. Weight is 4.</Typography>
        <Typography><strong>Revolver:</strong> Ranged; Damage 6; Critical 4; Range [Medium]; Accurate 1. Weight is 8.</Typography>
        <Typography><strong>Assault Rifle</strong> Ranged; Damage 8; Critical 3; Range [Long]; Auto-fire. Weight is 24.</Typography>
      </Box>,

      // Ship Integrity
      <Box key="integrity" maxHeight="750px" overflow="auto">
        <Typography>As the days go on and the ship systems are used more, the components may begin to break. The ship is split into four categories: Teleporter, Inverse Teleporter, Console, and Nav System.</Typography>
        <br />
        <Divider>Component Responsibilities</Divider>
        <Typography><strong>Teleporter:</strong> Teleports players to the ship.</Typography>
        <Typography><strong>Inverse Teleporter:</strong> Teleports players inside the facility.</Typography>
        <Typography><strong>Console:</strong> Planetary scanning, Entity Scanning, Hacking related things, and messages.</Typography>
        <Typography><strong>Nav System:</strong> Movement from orbit to a specified moon, Weather types on the different moons, and Map view of players.</Typography>
        <br />
        <Divider>Integrity Loss</Divider>
        <Typography textAlign="center">Each component has 3 integrity, degrading as time goes on. Below are the effects on each section and are accumulative.</Typography>
        <br />
        <Stack direction="row" spacing={2}>
          <Box width="25%">
            <Typography><strong>Teleporter</strong></Typography>
            <Typography>3: Works as expected.</Typography>
            <Typography>2: Has a 20% chance to not work but still places the teleporter on cooldown.</Typography>
            <Typography>1: Has a 50% chance to teleport an unintended entity or player.</Typography>
            <Typography>0: Does not work.</Typography>
          </Box>
          <Box width="25%">
            <Typography><strong>Inverse Teleporter</strong></Typography>
            <Typography>3: Works as expected.</Typography>
            <Typography>2: Has a 20% chance to not work but still places the teleporter on cooldown.</Typography>
            <Typography>1: Has a 50% chance to teleport the player outside of the facility at a random location.</Typography>
            <Typography>0: Does not work.</Typography>
          </Box>
          <Box width="25%">
            <Typography><strong>Console</strong></Typography>
            <Typography>3: Works as expected.</Typography>
            <Typography>2: Planetary scanning now may display unknown entities or false reports.</Typography>
            <Typography>1: The difficulty of all hacking actions is increased by 1. Also, messages may now be half the size.</Typography>
            <Typography>0: The Seek Entity and Planetary Scan maneuvers no longer work.</Typography>
          </Box>
          <Box>
            <Typography><strong>Nav System</strong></Typography>
            <Typography>3: Works as expected.</Typography>
            <Typography>2: Weather types are no longer displayed.</Typography>
            <Typography>1: The map no longer displays. The Scan Room maneuver no longer works.</Typography>
            <Typography>0: When traveling to a different moon, it is now selected at random.</Typography>
          </Box>
        </Stack>
        <br />
        <Divider>Repairing</Divider>
        <Typography>Components of the ship may be repaired for 50 credits per integrity. Credits or scrap may be used to repair, but any excess value within the scrap is not returned. The skill used to repair is based on the scrap used as credits.</Typography>
        <Typography>Actual credits and glass use the Crafting [General] skill.</Typography>
        <Typography>Metal uses the Metalworking skill.</Typography>
        <Typography>Leather, cloth, fabric, and plastic use the Leatherworking skill.</Typography>
        <Typography>If more than one type is present, the type donating the most credit value determines the skill used.</Typography>
      </Box>
    ];

    return lethalContent[lethalValue] || lethalContent[0];
  };

  if (!isLoggedIn) {
    return <NotLoggedIn />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h3" gutterBottom textAlign="center" fontWeight="bold">
          RPG Information System
        </Typography>
        <Typography variant="h6" textAlign="center" sx={{ opacity: 0.9 }}>
          Complete rulebook for tabletop RPG campaigns
        </Typography>
      </Paper>

      <Stack spacing={3}>
        {/* General Rules */}
        <Accordion defaultExpanded>
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) },
              p: { xs: 2, sm: 3 }
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant={{ xs: 'h6', sm: 'h5' }} fontWeight="600">
                General Rules
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Tabs 
              value={generalValue} 
              onChange={(e, val) => setGeneralValue(val)} 
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
            >
              <Tab label="Actions per Turn" />
              <Tab label="Max Stats" />
              <Tab label="Dice Spending" />
              <Tab label="Status Effects" />
              <Tab label="Combat" />
              <Tab label="Hacking" />
              <Tab label="Healing" />
              <Tab label="Time" />
              <Tab label="Durability" />
              <Tab label="Diseases" />
            </Tabs>
            <Box sx={{ p: 3 }}>
              <DisplayGeneralTab />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Character Creation */}
        <Accordion>
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              bgcolor: alpha('#4CAF50', 0.1),
              '&:hover': { bgcolor: alpha('#4CAF50', 0.15) },
              p: { xs: 2, sm: 3 }
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant={{ xs: 'h6', sm: 'h5' }} fontWeight="600">
                Character Creation and Experience Points
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack spacing={3}>
              {/* Custom Species/Archetype */}
              <Paper 
                elevation={2} 
                sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  borderRadius: 2, 
                  border: '2px solid #4CAF50',
                  bgcolor: alpha('#4CAF50', 0.02)
                }}
              >
                <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                    Custom Species/Archetype
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  {[
                    { 
                      step: '1', 
                      title: 'Starting Characteristics', 
                      desc: 'All characteristics begin at 1',
                    },
                    { 
                      step: '2', 
                      title: 'Free Skill Level', 
                      desc: 'Gain 1 level in any skill of your choosing',
                    },
                    { 
                      step: '3', 
                      title: 'Wound Threshold', 
                      desc: 'Choose between 8-12, then add your Brawn',
                      example: 'Example: 9 chosen + 4 Brawn = 13 wounds',
                    },
                    { 
                      step: '4', 
                      title: 'Strain Threshold', 
                      desc: '(20 - chosen wounds) + Willpower',
                      example: 'Example: (20 - 9) + 3 Willpower = 14 strain',
                    },
                    { 
                      step: '5', 
                      title: 'Experience Points', 
                      desc: '230 XP to spend + 2 custom abilities',
                    },
                    { 
                      step: '6', 
                      title: 'Bonus XP', 
                      desc: 'Additional 50 XP for non-characteristics',
                    }
                  ].map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          p: { xs: 1.5, sm: 2 }, 
                          minHeight: { xs: '120px', sm: '140px' },
                          borderRadius: 2,
                          border: `1px solid ${alpha('#4CAF50', 0.3)}`,
                          bgcolor: 'white',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Box display="flex" alignItems="flex-start" gap={1.5}>
                          <Box 
                            sx={{ 
                              width: { xs: 28, sm: 32 }, 
                              height: { xs: 28, sm: 32 }, 
                              borderRadius: '50%', 
                              bgcolor: '#4CAF50',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: { xs: '0.8rem', sm: '0.9rem' },
                              flexShrink: 0
                            }}
                          >
                            {item.step}
                          </Box>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ 
                              fontSize: { xs: '0.8rem', sm: '0.875rem' },
                              lineHeight: 1.2
                            }}>
                              {item.title}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              mb: 1,
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              lineHeight: 1.3
                            }}>
                              {item.desc}
                            </Typography>
                            {item.example && (
                              <Typography variant="caption" sx={{ 
                                color: '#666',
                                fontStyle: 'italic',
                                display: 'block',
                                bgcolor: alpha('#4CAF50', 0.1),
                                p: 0.5,
                                borderRadius: 0.5,
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                lineHeight: 1.2
                              }}>
                                {item.example}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
                
              {/* Custom Career */}
              <Paper 
                elevation={2} 
                sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  borderRadius: 2, 
                  border: '2px solid #2196F3',
                  bgcolor: alpha('#2196F3', 0.02)
                }}
              >
                <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#2196F3' }}>
                    Custom Career
                  </Typography>
                </Box>
                
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  You may choose 8 skills to be your career skills. Out of those 8, choose 4 to add a level in. 
                  The skill chosen with your species/archetype may be chosen here.
                </Typography>
              
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        border: `1px solid ${alpha('#2196F3', 0.3)}`,
                        bgcolor: 'white',
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#2196F3' }}>
                        STEP 1
                      </Typography>
                      <Typography variant="body2">
                        Choose 8 skills to be part of your career
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        border: `1px solid ${alpha('#2196F3', 0.3)}`,
                        bgcolor: 'white',
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#2196F3' }}>
                        STEP 2
                      </Typography>
                      <Typography variant="body2">
                        Choose 4 out of the 8 to gain a level in
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
                    
              {/* Experience per Session */}
              <Paper 
                elevation={2} 
                sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  borderRadius: 2, 
                  border: '2px solid #FF9800',
                  bgcolor: alpha('#FF9800', 0.02)
                }}
              >
                <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#FF9800' }}>
                    Experience per Session
                  </Typography>
                </Box>
              
                <Grid container spacing={2}>
                  {[
                    { 
                      title: 'Baseline XP', 
                      desc: 'You gain 5 XP as a baseline each session',
                      color: '#4CAF50'
                    },
                    { 
                      title: 'Encounter XP', 
                      desc: 'For every social, combat, or hacking encounter you succeed in, gain 1 XP (maximum of 5)',
                      color: '#2196F3'
                    },
                    { 
                      title: 'Bonus XP', 
                      desc: 'Special events and achievements may award additional experience',
                      color: '#9C27B0'
                    }
                  ].map((xp, index) => (
                    <Grid item xs={12} key={index}>
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2,
                          border: `1px solid ${alpha(xp.color, 0.3)}`,
                          bgcolor: alpha(xp.color, 0.05)
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: xp.color }}>
                              {xp.title.toUpperCase()}
                            </Typography>
                            <Typography variant="body2">
                              {xp.desc}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Skills */}
        <Accordion>
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              bgcolor: alpha('#2196F3', 0.1),
              '&:hover': { bgcolor: alpha('#2196F3', 0.15) },
              p: { xs: 2, sm: 3 }
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant={{ xs: 'h6', sm: 'h5' }} fontWeight="600">
                Skills
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack spacing={3}>
              {/* Important Notes */}
              <Paper 
                elevation={2} 
                sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  borderRadius: 2, 
                  border: '2px solid #F44336',
                  bgcolor: alpha('#F44336', 0.05)
                }}
              >
                <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#F44336' }}>
                    Important Skill Rules
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: { xs: 1.5, sm: 2 }, 
                        borderRadius: 2,
                        border: `1px solid ${alpha('#F44336', 0.3)}`,
                        bgcolor: 'white',
                        minHeight: { xs: '100px', sm: '120px' },
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1.5} sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ 
                          color: '#F44336',
                          fontSize: { xs: '0.8rem', sm: '0.875rem' }
                        }}>
                          TIER 6 SKILLS
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        lineHeight: 1.3,
                        flex: 1
                      }}>
                        Can only be acquired by having the skill at tier 5 and having a skill upgrade point. 
                        These points are awarded for quests and achievements.
                      </Typography>
                    </Paper>
                  </Grid>
                    
                  <Grid item xs={12} sm={6}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: { xs: 1.5, sm: 2 }, 
                        borderRadius: 2,
                        border: `1px solid ${alpha('#F44336', 0.3)}`,
                        bgcolor: 'white',
                        minHeight: { xs: '100px', sm: '120px' },
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1.5} sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ 
                          color: '#F44336',
                          fontSize: { xs: '0.8rem', sm: '0.875rem' }
                        }}>
                          REMOVED SKILLS
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        lineHeight: 1.3,
                        flex: 1
                      }}>
                        The Alchemy skill has been completely removed from the game.
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
                    
              {/* Custom Skills */}
              <Paper 
                elevation={2} 
                sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  borderRadius: 2, 
                  border: '2px solid #2196F3',
                  bgcolor: alpha('#2196F3', 0.02)
                }}
              >
                <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#2196F3' }}>
                    Custom Skills
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  {[
                    { 
                      skill: 'Sanity', 
                      stat: 'Willpower', 
                      desc: 'Used to prevent yourself from going insane', 
                      color: '#9C27B0'
                    },
                    { 
                      skill: 'Knowledge [General]', 
                      stat: 'Intellect', 
                      desc: 'Used to determine non-specific knowledge on a subject', 
                      color: '#4CAF50'
                    },
                    { 
                      skill: 'Knowledge [Mechanics]', 
                      stat: 'Intellect', 
                      desc: 'Used to determine how a piece of machinery or technology operates', 
                      color: '#FF9800'
                    },
                    { 
                      skill: 'Knowledge [Lore]', 
                      stat: 'Intellect', 
                      desc: 'Used to understand or determine things about how the Backrooms came to be and about the levels and entities', 
                      color: '#795548'
                    },
                    { 
                      skill: 'Knowledge [Objects]', 
                      stat: 'Intellect', 
                      desc: 'Used to determine how an object works or should be interacted with', 
                      color: '#607D8B'
                    },
                    { 
                      skill: 'Metalworking', 
                      stat: 'Brawn', 
                      desc: 'Used to craft things using the Armorer, Blacksmith, or Goldsmith tools', 
                      color: '#F44336'
                    },
                    { 
                      skill: 'Leatherworking', 
                      stat: 'Agility', 
                      desc: 'Used to craft things using the Leatherworker and Weaver tools', 
                      color: '#E91E63'
                    },
                    { 
                      skill: 'Crafting [General]', 
                      stat: 'Intellect', 
                      desc: 'Used to craft things using the Alchemist, Carpenter, and Culinarian tools', 
                      color: '#3F51B5'
                    }
                  ].map((skill, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          p: { xs: 1.5, sm: 2 },
                          borderRadius: 2,
                          border: `2px solid ${skill.color}`,
                          height: { xs: '140px', sm: '160px' },
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          bgcolor: alpha(skill.color, 0.02)
                        }}
                      >
                        <Box>
                          <Box display="flex" alignItems="center" gap={1.5} sx={{ mb: 1 }}>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold" sx={{ 
                                color: skill.color,
                                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                lineHeight: 1.2
                              }}>
                                {skill.skill.toUpperCase()}
                              </Typography>
                              <Box sx={{ 
                                bgcolor: skill.color, 
                                color: 'white',
                                px: 0.5,
                                py: 0.25,
                                borderRadius: 0.5,
                                fontSize: { xs: '0.6rem', sm: '0.7rem' },
                                fontWeight: 'bold',
                                display: 'inline-block',
                                mt: 0.25
                              }}>
                                {skill.stat}
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                            
                        <Typography variant="caption" sx={{ 
                          lineHeight: 1.3,
                          fontSize: { xs: '0.7rem', sm: '0.75rem' }
                        }}>
                          {skill.desc}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Talents */}
        <Accordion>
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              bgcolor: alpha('#FF9800', 0.1),
              '&:hover': { bgcolor: alpha('#FF9800', 0.15) },
              p: { xs: 2, sm: 3 }
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant={{ xs: 'h6', sm: 'h5' }} fontWeight="600">
                Talents
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack spacing={3}>
              {/* Section Header */}
              <Box textAlign="center">
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#FF9800', mb: 1 }}>
                  Custom Talents
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Special abilities organized by tier and activation type
                </Typography>
              </Box>
          
              {/* Talents Grid */}
              <Grid container spacing={2}>
                {[
                  { 
                    name: 'Healer', 
                    tier: 1, 
                    activation: 'Active (Action)', 
                    ranked: 'Yes', 
                    desc: 'You may spend an action to perform a medicine check. This may be done equal to the amount of times this talent has been purchased per day.',
                    color: '#4CAF50'
                  },
                  { 
                    name: 'Lightning Striker', 
                    tier: 1, 
                    activation: 'Passive', 
                    ranked: 'No', 
                    desc: 'Weapons that use brawl have the reactive equipment trait.',
                    color: '#FFC107'
                  },
                  { 
                    name: 'Bulked Load', 
                    tier: 2, 
                    activation: 'Passive', 
                    ranked: 'Yes', 
                    desc: 'Your encumbrance threshold is now one higher.',
                    color: '#2196F3'
                  },
                  { 
                    name: 'Adjust Eyes (Dark)', 
                    tier: 3, 
                    activation: 'Active (Action)', 
                    ranked: 'No', 
                    desc: 'You may ignore all difficulties due to darkness for the next 5 rounds.',
                    color: '#673AB7'
                  },
                  { 
                    name: 'Adjust Eyes (Light)', 
                    tier: 3, 
                    activation: 'Active (Action)', 
                    ranked: 'No', 
                    desc: 'You may ignore all difficulties due to light for the next 5 rounds.',
                    color: '#FF9800'
                  },
                  { 
                    name: 'Savage Attacker', 
                    tier: 4, 
                    activation: 'Active (Incidental)', 
                    ranked: 'No', 
                    desc: 'When you inflict a critical injury, you may spend 2 strain and an incidental to activate this talent. You may select the critical injury inflicted that is within the same severity as the one rolled.',
                    color: '#F44336'
                  },
                  { 
                    name: 'Unshakable Will', 
                    tier: 5, 
                    activation: 'Passive', 
                    ranked: 'No', 
                    desc: 'You receive 5 points. These points may be spent to reduce one strain damage each. These points replenish at the beginning of your turn.',
                    color: '#9C27B0'
                  },
                  { 
                    name: 'Unwavering Resilience', 
                    tier: 5, 
                    activation: 'Passive', 
                    ranked: 'No', 
                    desc: 'Your wound threshold increases by 10.',
                    requirements: 'Requires: Toughened 4',
                    color: '#795548'
                  },
                  { 
                    name: 'Unbreakable Fortitude', 
                    tier: 5, 
                    activation: 'Passive', 
                    ranked: 'No', 
                    desc: 'Your strain threshold increases by 5.',
                    requirements: 'Requires: Grit 4',
                    color: '#607D8B'
                  }
                ].map((talent, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: 2,
                        border: `2px solid ${talent.color}`,
                        minHeight: { xs: '180px', sm: '200px' },
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: alpha(talent.color, 0.02)
                      }}
                    >
                      {/* Header */}
                      <Box display="flex" alignItems="center" gap={1.5} sx={{ mb: 1.5 }}>
                        <Box 
                          sx={{ 
                            width: { xs: 28, sm: 32 }, 
                            height: { xs: 28, sm: 32 }, 
                            borderRadius: 1, 
                            bgcolor: talent.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: { xs: '0.7rem', sm: '0.8rem' },
                            flexShrink: 0
                          }}
                        >
                          T{talent.tier}
                        </Box>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ 
                          color: talent.color, 
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          lineHeight: 1.2,
                          flex: 1,
                          minWidth: 0
                        }}>
                          {talent.name.toUpperCase()}
                        </Typography>
                      </Box>
                      
                      {/* Properties */}
                      <Stack spacing={0.5} sx={{ mb: 1.5 }}>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          <Box sx={{ 
                            bgcolor: alpha(talent.color, 0.1), 
                            px: 0.75,
                            py: 0.25,
                            borderRadius: 0.5,
                            fontSize: { xs: '0.6rem', sm: '0.7rem' },
                            fontWeight: 'bold',
                            color: talent.color,
                            border: `1px solid ${alpha(talent.color, 0.3)}`
                          }}>
                            {talent.activation}
                          </Box>
                          <Box sx={{ 
                            bgcolor: talent.ranked === 'Yes' ? alpha('#4CAF50', 0.1) : alpha('#F44336', 0.1), 
                            px: 0.75,
                            py: 0.25,
                            borderRadius: 0.5,
                            fontSize: { xs: '0.6rem', sm: '0.7rem' },
                            fontWeight: 'bold',
                            color: talent.ranked === 'Yes' ? '#4CAF50' : '#F44336',
                            border: `1px solid ${alpha(talent.ranked === 'Yes' ? '#4CAF50' : '#F44336', 0.3)}`
                          }}>
                            Ranked: {talent.ranked}
                          </Box>
                        </Box>
                        
                        {talent.requirements && (
                          <Typography variant="caption" sx={{ 
                            color: '#666',
                            fontStyle: 'italic',
                            fontSize: { xs: '0.65rem', sm: '0.7rem' }
                          }}>
                            {talent.requirements}
                          </Typography>
                        )}
                      </Stack>
                      
                      {/* Description */}
                      <Typography variant="caption" sx={{ 
                        lineHeight: 1.3,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        flex: 1,
                        display: 'flex',
                        alignItems: 'flex-end'
                      }}>
                        {talent.desc}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Equipment Traits */}
        <Accordion>
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              bgcolor: alpha('#9C27B0', 0.1),
              '&:hover': { bgcolor: alpha('#9C27B0', 0.15) },
              p: { xs: 2, sm: 3 }
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant={{ xs: 'h6', sm: 'h5' }} fontWeight="600">
                Equipment Traits
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack spacing={3}>
              {/* Section Header */}
              <Box textAlign="center">
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#9C27B0', mb: 1 }}>
                  Custom Equipment Traits
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Special weapon and equipment properties for enhanced combat
                </Typography>
              </Box>
          
              {/* Equipment Traits Grid */}
              <Grid container spacing={2}>
                {[
                  { 
                    trait: 'AutoHit', 
                    desc: 'The weapon automatically hits the target. The dice pool is always two ability and one proficiency dice.',
                    color: '#4CAF50',
                    type: 'Guaranteed'
                  },
                  { 
                    trait: 'Reactive', 
                    desc: 'A weapon with the reactive trait allows an attack to be made as an out-of-turn incidental when an enemy leaves engaged range. This attack may not be dual-wielded.',
                    color: '#FF9800',
                    type: 'Defensive'
                  },
                  { 
                    trait: 'Reach', 
                    desc: 'A weapon with reach may be used one range further than its maximum range.',
                    color: '#2196F3',
                    type: 'Range'
                  },
                  { 
                    trait: 'Breaking', 
                    desc: 'Each time this weapon is used, it reduces its durability by 1.',
                    color: '#F44336',
                    type: 'Durability'
                  },
                  { 
                    trait: 'Flurry', 
                    desc: 'After a successful hit, you may spend 1 advantage to hit with this weapon again. This can be done x times where x is the rank of this trait.',
                    color: '#9C27B0',
                    type: 'Combo'
                  },
                  { 
                    trait: 'Sneak', 
                    desc: 'The first attack with this weapon in an encounter adds two successes automatically.',
                    color: '#607D8B',
                    type: 'Stealth'
                  }
                ].map((trait, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: 2,
                        border: `2px solid ${trait.color}`,
                        minHeight: { xs: '140px', sm: '160px' },
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: alpha(trait.color, 0.02)
                      }}
                    >
                      {/* Header */}
                      <Box display="flex" alignItems="center" gap={1.5} sx={{ mb: 1.5 }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle1" fontWeight="bold" sx={{ 
                            color: trait.color, 
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            lineHeight: 1.2
                          }}>
                            {trait.trait.toUpperCase()}
                          </Typography>
                          <Box sx={{ 
                            bgcolor: alpha(trait.color, 0.1), 
                            px: 0.75,
                            py: 0.25,
                            borderRadius: 0.5,
                            fontSize: { xs: '0.6rem', sm: '0.7rem' },
                            fontWeight: 'bold',
                            color: trait.color,
                            border: `1px solid ${alpha(trait.color, 0.3)}`,
                            display: 'inline-block',
                            mt: 0.5
                          }}>
                            {trait.type}
                          </Box>
                        </Box>
                      </Box>
                        
                      {/* Description */}
                      <Typography variant="body2" sx={{ 
                        lineHeight: 1.4,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        {trait.desc}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Environmental Effects */}
        <Accordion>
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              bgcolor: alpha(theme.palette.error.main, 0.1),
              '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.15) },
              p: { xs: 2, sm: 3 }
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant={{ xs: 'h6', sm: 'h5' }} fontWeight="600">
                Environmental Effects
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Tabs 
              value={effectValue} 
              onChange={(e, val) => setEffectValue(val)} 
              variant="scrollable"
              sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
            >
              <Tab label="Lighting" />
              <Tab label="Exhaustion" />
              <Tab label="Fear & Sanity" />
              <Tab label="Resting" />
              <Tab label="Atmosphere" />
              <Tab label="Falling" />
            </Tabs>
            <Box sx={{ p: 3 }}>
              <DisplayEffectTab />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Lethal Company Rules */}
        <Accordion>
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) },
              p: { xs: 2, sm: 3 }
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant={{ xs: 'h6', sm: 'h5' }} fontWeight="600">
                Lethal Company Rules
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Tabs 
              value={lethalValue} 
              onChange={(e, val) => setLethalValue(val)} 
              variant="scrollable"
              sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
            >
              <Tab label="General" />
              <Tab label="Weight" />
              <Tab label="Weather" />
              <Tab label="Ship" />
              <Tab label="Death" />
              <Tab label="Lighting" />
              <Tab label="Homebrew" />
              <Tab label="Suits" />
              <Tab label="Additional" />
              <Tab label="Weapons" />
              <Tab label="Ship Systems" />
            </Tabs>
            <Box sx={{ p: 3 }}>
              <DisplayLethalTab />
            </Box>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Container>
  );
}