import { Box, Button, Card, Chip, Dialog,Typography, CardContent,CardHeader,Stack,Paper,Fade,Avatar,Grid,IconButton,Table,TableBody,TableCell,TableHead,TableRow,TableContainer} from "@mui/material";
import db from '../Components/firebase';
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Visibility,VisibilityOff,Close,AutoAwesome,Psychology,List,Science,TrendingUp,Repeat } from '@mui/icons-material';

export default function Craft(props) {
  const materials = props.currCraft.dynamicMaterial ? props.currCraft.dynamicMaterial.split('/') : [];
  const difficulties = props.currCraft.difficultyModifier ? props.currCraft.difficultyModifier.split('/') : [];
  const attempts = props.currCraft.attemptsModifier ? props.currCraft.attemptsModifier.split('/') : [];
  const effects = props.currCraft.dynamicEffect ? props.currCraft.dynamicEffect.split('/') : [];
  const [open, setOpen] = useState(false);

  // Get craft complexity color based on difficulty
  const getCraftTheme = (baseDifficulty) => {
    const difficulty = parseInt(baseDifficulty);

    if(baseDifficulty === 'Dynamic') {
      return {
        color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        category: 'Dynamic',
        chipColor: 'success'
      }
    }

    if (difficulty <= 2) {
      return {
        color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        category: 'Simple',
        chipColor: 'success'
      };
    } else if (difficulty <= 4) {
      return {
        color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        category: 'Moderate',
        chipColor: 'primary'
      };
    } else if (difficulty <= 6) {
      return {
        color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        category: 'Complex',
        chipColor: 'warning'
      };
    } else {
      return {
        color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        category: 'Master',
        chipColor: 'error'
      };
    }
  };

  // Get craft type icon based on name
  const getCraftIcon = (name) => {
    const craftName = name.toLowerCase();
    if (craftName.includes('weapon') || craftName.includes('sword') || craftName.includes('blade')) return '⚒️';
    if (craftName.includes('armor') || craftName.includes('shield') || craftName.includes('protection')) return '🛡️';
    if (craftName.includes('potion') || craftName.includes('elixir') || craftName.includes('brew')) return '🧪';
    if (craftName.includes('enchant') || craftName.includes('magic') || craftName.includes('spell')) return '✨';
    if (craftName.includes('tool') || craftName.includes('instrument')) return '🔧';
    if (craftName.includes('jewelry') || craftName.includes('ring') || craftName.includes('amulet')) return '💍';
    if (craftName.includes('scroll') || craftName.includes('tome') || craftName.includes('book')) return '📜';
    return '🔨'; // Default crafting icon
  };

  const theme = getCraftTheme(props.currCraft.baseDifficulty);
  const isAdmin = localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN';
  const isHidden = props.currCraft.hidden === 'Yes';
  
  // Fix dynamic materials detection
  const hasDynamicMaterials = props.currCraft.dynamicMaterial && 
                              props.currCraft.dynamicMaterial !== 'None' && 
                              props.currCraft.difficultyModifier && 
                              materials.length > 0;

  const flipHidden = () => {
    updateDoc(doc(db, 'Crafts', props.currCraft.name), {
      hidden: props.currCraft.hidden === 'Yes' ? 'No' : 'Yes'
    })
  }

  const InfoSection = ({ icon, title, children }) => (
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
      <Box display="flex" alignItems="center" gap={1} mb={1.5}>
        {icon}
        <Typography variant="h6" fontWeight="bold" color="white">
          {title}
        </Typography>
      </Box>
      {children}
    </Paper>
  );

  const ListItem = ({ index, text }) => (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        mb: 1,
        borderRadius: 1.5,
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <Typography variant="body2" color="rgba(255,255,255,0.9)">
        <Typography component="span" fontWeight="bold" color="white">
          {index + 1}.
        </Typography>{' '}
        {text}
      </Typography>
    </Paper>
  );

  return (
    <>
      <Fade in timeout={500}>
        <Card 
          elevation={8}
          sx={{
            width: { xs: '100%', md: '450px' },
            height: '500px',
            borderRadius: 4,
            background: theme.color,
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
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  fontSize: '1.5rem'
                }}
              >
                {getCraftIcon(props.currCraft.name)}
              </Avatar>
            }
            title={
              <Typography variant="h5" fontWeight="bold" color="white">
                {props.currCraft.name}
              </Typography>
            }
            subheader={
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5} sx={{ mt: 1 }}>
                <Chip
                  label={theme.category}
                  size="small"
                  color={theme.chipColor}
                  sx={{ fontWeight: 'bold' }}
                />
                <Chip
                  icon={<TrendingUp />}
                  label={`Difficulty ${props.currCraft.baseDifficulty}`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white'
                  }}
                />
                <Chip
                  icon={<Repeat />}
                  label={`${props.currCraft.baseAttempts} Attempts`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white'
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
            }
          }}>
            
            {/* Components */}
            <InfoSection icon={<List />} title="Required Components">
              {props.currCraft.components.split('/').map((component, index) => (
                <ListItem key={index} index={index} text={component} />
              ))}
            </InfoSection>

            {/* Skills */}
            <InfoSection icon={<Psychology />} title="Required Skills">
              {props.currCraft.skills.split('/').map((skill, index) => (
                <ListItem key={index} index={index} text={skill} />
              ))}
            </InfoSection>

            {/* Dynamic Materials Table */}
            {hasDynamicMaterials && (
              <InfoSection icon={<Science />} title="Material Variations">
                <TableContainer 
                  component={Paper} 
                  sx={{ 
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 2
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Material</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Difficulty</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Attempts</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {materials.map((mat, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ color: 'rgba(255,255,255,0.9)' }}>{mat}</TableCell>
                          <TableCell sx={{ color: 'rgba(255,255,255,0.9)' }}>{difficulties[index]}</TableCell>
                          <TableCell sx={{ color: 'rgba(255,255,255,0.9)' }}>{attempts[index]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </InfoSection>
            )}
          </CardContent>

          {/* Action Buttons */}
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
            {hasDynamicMaterials && effects.length > 0 && (
              <Button
                onClick={() => setOpen(true)}
                variant="contained"
                size="small"
                startIcon={<AutoAwesome />}
                sx={{
                  bgcolor: 'rgba(255,215,0,0.3)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    bgcolor: 'rgba(255,215,0,0.5)'
                  },
                  borderRadius: 3,
                  fontSize: '0.75rem'
                }}
              >
                Material Effects
              </Button>
            )}
            
            {isAdmin && (
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
                {isHidden ? 'Show' : 'Hide'} Craft
              </Button>
            )}
          </Box>
        </Card>
      </Fade>

      {/* Enhanced Material Effects Dialog */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: theme.color,
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
          <Box display="flex" alignItems="center" gap={1}>
            <AutoAwesome />
            <Typography variant="h5" fontWeight="bold">
              {props.currCraft.name} - Material Effects
            </Typography>
          </Box>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {materials.map((mat, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    minHeight: '150px'
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" color="white" gutterBottom>
                    {mat}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="rgba(255,255,255,0.9)"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {effects[index]}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Dialog>
    </>
  )
}