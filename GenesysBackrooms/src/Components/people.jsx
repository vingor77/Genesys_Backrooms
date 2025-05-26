import { Box, Button, Card, Dialog, Typography, CardContent,CardHeader,Avatar,Chip,Stack,IconButton,Tooltip,Fade,Paper } from "@mui/material";
import db from '../Components/firebase';
import { doc, updateDoc } from "firebase/firestore";
import EntityItem from "./entityItem";
import { useState } from "react";
import { Person,Visibility,VisibilityOff,Group,Psychology,Star,FitnessCenter,Close,Info } from '@mui/icons-material';

export default function People(props) {
  const [open, setOpen] = useState(false);

  const affiliations = props.currPerson.importantAffiliations
    ? props.currPerson.importantAffiliations.split('/').filter(Boolean)
    : [];

  const flipHidden = () => {
    updateDoc(doc(db, 'PeopleOfInterest', props.currPerson.name), {
      hidden: props.currPerson.hidden === 'Yes' ? 'No' : 'Yes'
    })
  }

  const isAdmin = localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN';
  const isHidden = props.currPerson.hidden === 'Yes';
  const isFighter = props.currPerson.fighter === 'Yes';

  // Get background color based on person's group/role
  const getCardGradient = () => {
    if (isHidden && isAdmin) {
      return 'linear-gradient(135deg, #666 0%, #999 100%)';
    }
    if (isFighter) {
      return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
    }
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
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
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        {icon}
        <Typography variant="h6" fontWeight="bold" color="white">
          {title}
        </Typography>
      </Box>
      {content && (
        <Typography 
          variant="body1" 
          color="rgba(255,255,255,0.9)"
          sx={{ lineHeight: 1.6, mb: chips.length > 0 ? 1 : 0 }}
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
    <>
      <Fade in timeout={500}>
        <Card 
          elevation={8}
          sx={{
            width: { xs: '100%', md: '520px' },
            height: '600px',
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
          {/* Header with Avatar and Name */}
          <CardHeader
            title={
              <Typography variant="h4" fontWeight="bold" color="white">
                {props.currPerson.name}
              </Typography>
            }
            action={
              <Stack direction="row" spacing={1}>
                {isFighter && (
                  <Tooltip title="Fighter - Has Combat Stats">
                    <Chip
                      icon={<FitnessCenter />}
                      label="Fighter"
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white'
                      }}
                    />
                  </Tooltip>
                )}
                {isHidden && isAdmin && (
                  <Tooltip title="Hidden from Players">
                    <Chip
                      icon={<VisibilityOff />}
                      label="Hidden"
                      size="small"
                      color="error"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white'
                      }}
                    />
                  </Tooltip>
                )}
              </Stack>
            }
            sx={{ pb: 1 }}
          />

          {/* Content */}
          <CardContent sx={{ 
            height: 'calc(100% - 120px)', 
            overflow: 'auto',
            p: 2,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255,255,255,0.3)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'rgba(255,255,255,0.5)',
            },
          }}>
            
            <InfoSection
              icon={<Info />}
              title="Introduction"
              content={props.currPerson.introduction}
            />

            <InfoSection
              icon={<Star />}
              title="Reason for Interest"
              content={props.currPerson.reason}
            />

            <InfoSection
              icon={<Psychology />}
              title="Personality"
              content={props.currPerson.personality}
            />

            <InfoSection
              icon={<Group />}
              title="Associated Group"
              content={props.currPerson.associatedGroup}
            />

            {affiliations.length > 0 && (
              <InfoSection
                icon={<Person />}
                title="Individual Affiliations"
                chips={affiliations}
              />
            )}
          </CardContent>

          {/* Action Buttons */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              right: 16,
              display: 'flex',
              gap: 1,
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            {isAdmin && (
              <Button
                onClick={flipHidden}
                variant="contained"
                startIcon={isHidden ? <Visibility /> : <VisibilityOff />}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)'
                  },
                  borderRadius: 3
                }}
              >
                {isHidden ? 'Show Person' : 'Hide Person'}
              </Button>
            )}
            
            {isFighter && (
              <Button
                onClick={() => setOpen(true)}
                variant="contained"
                startIcon={<FitnessCenter />}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)'
                  },
                  borderRadius: 3
                }}
              >
                Combat Stats
              </Button>
            )}
          </Box>
        </Card>
      </Fade>

      {/* Enhanced Dialog */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            {props.currPerson.name} - Combat Statistics
          </Typography>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ p: 2 }}>
          <EntityItem entity={props.currPerson} person={true} />
        </Box>
      </Dialog>
    </>
  )
}