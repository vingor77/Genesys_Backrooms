import { Box, Button, Typography, Card,CardContent,CardHeader,Grid,Chip,Stack,Paper,Fade,Avatar,Divider,LinearProgress } from "@mui/material";
import { collection, doc, onSnapshot, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import { useState } from "react";
import NotLoggedIn from "../Components/notLoggedIn";
import { AutoAwesome,Shield,Inventory,Star,Add } from '@mui/icons-material';

export default function SetBonuses() {
  const [bonuses, setBonuses] = useState([]);

  const data = [{"name":"Red Knight Replicas Set","equipment":"Red Knight Replica Gloves/Red Knight Replica Greaves/Red Knight Replica Helmet/Red Knight Replica Plate/Red Knight Replica Sword/Red Knight Replica Shield","completionNumber":"2/4/6","effect":"Effect 1/Effect 2/Effect 3"},
    {"name":"Holy Set","equipment":"Holy Arm Guards/Holy Armor/Holy Greaves/Holy Hood/Holy Leggings/Retributor","completionNumber":"2/4/6","effect":"Effect 1/Effect 2/Effect 3"},
    {"name":"Steampunk Set","equipment":"Amplimotive Armor/Goggles of Many Actions","completionNumber":"2","effect":"Enter set bonus here"},
    {"name":"Shadows Set","equipment":"Shadow Hide/Boots of Shadow/Ring of Shadows/Smoked Pants","completionNumber":"3","effect":"Enter set bonus here"},
    {"name":"Healer Set","equipment":"Necklace of Healing/Wristlet of Healing","completionNumber":"2","effect":"At the start of each day, all items part of this set regain 10 charges. In addition, you gain an automatic success and advantage on all healing checks you perform."},
    {"name":"Weather Set","equipment":"Wristband of Summer/Wristband of Winter","completionNumber":"1","effect":"Effect here"},
    {"name":"Flight Set","equipment":"Winged Boots/Wings of Flying","completionNumber":"2","effect":"Effect here"}]
    
  const addData = () => {
    for(let i = 0; i < data.length; i++) {
      setDoc(doc(db, 'setBonuses', data[i].name), {
        name: data[i].name,
        equipment: data[i].equipment,
        completionNumber: data[i].completionNumber,
        effect: data[i].effect
      })
    }
  }

  const getFromDB = () => {
    const q = query(collection(db, 'setBonuses'));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      })
      setBonuses(queryData);
    })

    return () => {
      unsub();
    }
  }

  // Get set theme color based on name
  const getSetTheme = (setName) => {
    const themes = {
      'Red Knight': { 
        color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
        icon: '⚔️',
        category: 'Combat'
      },
      'Holy': { 
        color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
        icon: '✨',
        category: 'Divine'
      },
      'Steampunk': { 
        color: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', 
        icon: '⚙️',
        category: 'Mechanical'
      },
      'Shadows': { 
        color: 'linear-gradient(135deg, #64748b 0%, #475569 100%)', 
        icon: '🌙',
        category: 'Stealth'
      },
      'Healer': { 
        color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
        icon: '💚',
        category: 'Support'
      },
      'Weather': { 
        color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
        icon: '🌤️',
        category: 'Elemental'
      },
      'Flight': { 
        color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', 
        icon: '🪶',
        category: 'Movement'
      },
    };

    for (const [key, theme] of Object.entries(themes)) {
      if (setName.includes(key)) {
        return theme;
      }
    }
    
    return { 
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      icon: '🛡️',
      category: 'Equipment'
    };
  };

  const SetCard = ({ setData }) => {
    const theme = getSetTheme(setData.name);
    const equipment = setData.equipment.split('/');
    const effects = setData.effect.split('/');
    const completionNumbers = setData.completionNumber.split('/');
    const maxItems = equipment.length;

    return (
      <Fade in timeout={500}>
        <Card
          elevation={8}
          sx={{
            borderRadius: 4,
            background: theme.color,
            color: 'white',
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
                  width: 60,
                  height: 60,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  border: '3px solid rgba(255,255,255,0.3)',
                  fontSize: '1.8rem'
                }}
              >
                {theme.icon}
              </Avatar>
            }
            title={
              <Typography variant="h4" fontWeight="bold" color="white">
                {setData.name}
              </Typography>
            }
            subheader={
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip
                  label={theme.category}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
                <Chip
                  icon={<Inventory />}
                  label={`${maxItems} Items`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white'
                  }}
                />
              </Stack>
            }
            sx={{ pb: 1 }}
          />

          <CardContent sx={{ pt: 0 }}>
            <Grid container spacing={3}>
              {/* Equipment List */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Shield />
                    <Typography variant="h6" fontWeight="bold">
                      Equipment Pieces
                    </Typography>
                  </Box>
                  <Stack spacing={1}>
                    {equipment.map((item, index) => (
                      <Chip
                        key={index}
                        label={item}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.15)',
                          color: 'white',
                          justifyContent: 'flex-start',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.25)'
                          }
                        }}
                      />
                    ))}
                  </Stack>
                </Paper>
              </Grid>

              {/* Set Bonuses */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <AutoAwesome />
                    <Typography variant="h6" fontWeight="bold">
                      Set Bonuses
                    </Typography>
                  </Box>
                  <Stack spacing={2}>
                    {effects.map((effect, index) => {
                      const requiredItems = parseInt(completionNumbers[index]);
                      const progressPercentage = (requiredItems / maxItems) * 100;
                      
                      return (
                        <Paper
                          key={index}
                          elevation={1}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.1)'
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Star fontSize="small" />
                            <Typography variant="subtitle2" fontWeight="bold">
                              {requiredItems} Item{requiredItems > 1 ? 's' : ''} Required
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={progressPercentage}
                            sx={{
                              mb: 1,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: 'rgba(255,255,255,0.2)',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: 'rgba(255,255,255,0.8)',
                                borderRadius: 3
                              }
                            }}
                          />
                          <Typography variant="body2" color="rgba(255,255,255,0.9)">
                            {effect}
                          </Typography>
                        </Paper>
                      );
                    })}
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>
    );
  };

  const isAdmin = localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN';

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'grey.50' }}>
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Equipment Set Bonuses
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Discover powerful synergies by collecting complete equipment sets
          </Typography>
          
          {isAdmin && (
            <Button
              onClick={addData}
              variant="contained"
              size="large"
              startIcon={<Add />}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                }
              }}
            >
              Add Sample Data
            </Button>
          )}
        </Box>

        {/* Set Cards */}
        {bonuses.length > 0 ? (
          <Grid container spacing={4}>
            {bonuses.map((setData, index) => (
              <Grid item xs={12} key={index}>
                <SetCard setData={setData} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box>
            {getFromDB()}
            <Box textAlign="center" sx={{ mt: 8 }}>
              <Typography variant="h5" color="text.secondary">
                Loading equipment sets...
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
  );
}