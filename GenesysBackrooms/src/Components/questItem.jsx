import { Box, Button, Card, Chip, Typography, CardContent,CardHeader,Stack,Paper,Fade,LinearProgress} from "@mui/material";
import db from '../Components/firebase';
import { doc, updateDoc } from "firebase/firestore";
import {Assignment,CheckCircle,RadioButtonUnchecked,Visibility,VisibilityOff,Person,EmojiEvents,AutoAwesome,TurnedIn} from '@mui/icons-material';

export default function QuestItem(props) {
  const rewards = props.currQuest.rewards 
    ? props.currQuest.rewards.split("/").filter(Boolean)
    : [];

  const flipComplete = () => {
    updateDoc(doc(db, 'Quests', props.currQuest.name), {
      completed: props.currQuest.completed === 'Yes' ? 'No' : 'Yes'
    })
  }

  const flipHidden = () => {
    updateDoc(doc(db, 'Quests', props.currQuest.name), {
      hidden: props.currQuest.hidden === 'Yes' ? "No" : "Yes"
    })
  }

  const isAdmin = localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN';
  const isCompleted = props.currQuest.completed === 'Yes';
  const isHidden = props.currQuest.hidden === 'Yes';
  const isAutoAcquired = props.currQuest.acquisition === 'None';

  // Get background gradient based on quest status
  const getCardGradient = () => {
    if (isHidden && isAdmin) {
      return 'linear-gradient(135deg, #666 0%, #999 100%)';
    }
    if (isCompleted) {
      return 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)';
    }
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  // Get quest line color
  const getQuestLineColor = (questLine) => {
    const colors = {
      'Main': 'error',
      'Side': 'warning', 
      'Daily': 'info',
      'Weekly': 'secondary',
      'Event': 'success'
    };
    return colors[questLine] || 'primary';
  };

  const InfoSection = ({ icon, title, content, chips = [] }) => (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2, 
        mb: 2, 
        borderRadius: 2,
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={content || chips.length > 0 ? 1 : 0}>
        {icon}
        <Typography variant="subtitle1" fontWeight="bold" color="white">
          {title}
        </Typography>
      </Box>
      {content && (
        <Typography 
          variant="body2" 
          color="rgba(255,255,255,0.9)"
          sx={{ lineHeight: 1.5, mb: chips.length > 0 ? 1 : 0 }}
        >
          {content}
        </Typography>
      )}
      {chips.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          {chips.map((chip, index) => (
            <Chip
              key={index}
              label={chip}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)'
                }
              }}
            />
          ))}
        </Stack>
      )}
    </Paper>
  );

  return (
    <Fade in timeout={500}>
      <Card 
        elevation={8}
        sx={{
          width: { xs: '100%', md: '420px' },
          height: '450px',
          borderRadius: 4,
          background: getCardGradient(),
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-4px)',
            transition: 'transform 0.3s ease',
            boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
          }
        }}
      >
        {/* Header */}
        <CardHeader
          avatar={
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(255,255,255,0.3)'
              }}
            >
              {isCompleted ? (
                <CheckCircle sx={{ color: 'white', fontSize: 28 }} />
              ) : (
                <Assignment sx={{ color: 'white', fontSize: 28 }} />
              )}
            </Box>
          }
          title={
            <Typography variant="h5" fontWeight="bold" color="white" sx={{ mb: 0.5 }}>
              {props.currQuest.name}
            </Typography>
          }
          subheader={
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={props.currQuest.questLine}
                size="small"
                color={getQuestLineColor(props.currQuest.questLine)}
                sx={{ fontWeight: 'bold' }}
              />
              <Chip
                icon={isCompleted ? <CheckCircle /> : <RadioButtonUnchecked />}
                label={isCompleted ? "Complete" : "In Progress"}
                size="small"
                sx={{
                  bgcolor: isCompleted ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 152, 0, 0.3)',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
              {isHidden && isAdmin && (
                <Chip
                  icon={<VisibilityOff />}
                  label="Hidden"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(244, 67, 54, 0.3)',
                    color: 'white'
                  }}
                />
              )}
            </Stack>
          }
          sx={{ pb: 1 }}
        />

        {/* Content */}
        <CardContent sx={{ 
          height: 'calc(100% - 140px)', 
          overflow: 'auto',
          p: 2,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(255,255,255,0.5)',
          },
        }}>
          
          {/* Description */}
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              mb: 2, 
              borderRadius: 2,
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Typography 
              variant="body2" 
              color="rgba(255,255,255,0.9)"
              sx={{ lineHeight: 1.6, fontStyle: 'italic' }}
            >
              {props.currQuest.description}
            </Typography>
          </Paper>

          {/* Acquisition Info */}
          <InfoSection
            icon={isAutoAcquired ? <AutoAwesome /> : <Person />}
            title="Acquisition"
            content={
              isAutoAcquired 
                ? "This quest is automatically acquired"
                : `Acquired from ${props.currQuest.questGiver} in ${props.currQuest.acquisition}`
            }
          />

          {/* Turn-in Location */}
          <InfoSection
            icon={<TurnedIn />}
            title="Turn-in Location"
            content={props.currQuest.turnInLocation}
          />

          {/* Rewards */}
          {rewards.length > 0 && (
            <InfoSection
              icon={<EmojiEvents />}
              title="Rewards"
              chips={rewards}
            />
          )}
        </CardContent>

        {/* Action Buttons */}
        {isAdmin && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              right: 12,
              display: 'flex',
              gap: 1,
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Button
              onClick={flipComplete}
              variant="contained"
              size="small"
              startIcon={isCompleted ? <RadioButtonUnchecked /> : <CheckCircle />}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)'
                },
                borderRadius: 3,
                fontSize: '0.75rem'
              }}
            >
              Mark {isCompleted ? 'Incomplete' : 'Complete'}
            </Button>
            
            <Button
              onClick={flipHidden}
              variant="contained"
              size="small"
              startIcon={isHidden ? <Visibility /> : <VisibilityOff />}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)'
                },
                borderRadius: 3,
                fontSize: '0.75rem'
              }}
            >
              {isHidden ? 'Show' : 'Hide'} Quest
            </Button>
          </Box>
        )}

        {/* Progress Indicator */}
        <LinearProgress
          variant="determinate"
          value={isCompleted ? 100 : 50}
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            bgcolor: 'rgba(255,255,255,0.2)',
            '& .MuiLinearProgress-bar': {
              bgcolor: isCompleted ? '#4caf50' : '#ff9800'
            }
          }}
        />
      </Card>
    </Fade>
  )
}