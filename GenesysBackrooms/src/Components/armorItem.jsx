import { Box, Button, Card, Chip, Dialog,Typography, CardContent,CardHeader,Stack,Paper,Fade,Avatar,Grid,IconButton,Divider } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import db from '../Components/firebase';
import { Shield,AttachMoney,Build,Security,FitnessCenter,AutoAwesome,Visibility,VisibilityOff,Close,StarRate } from '@mui/icons-material';

export default function ArmorItem(props) {
  const [anomalousDisplayed, setAnomalousDisplayed] = useState(false);

  const defenses = props.currArmor.defense.split("/");
  const specials = props.currArmor.specials ? props.currArmor.specials.split("/").filter(Boolean) : [];

  // Get rarity color and gradient
  const getRarityInfo = (rarity) => {
    const rarityMap = {
      'Common': { 
        color: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
        chipColor: 'default'
      },
      'Uncommon': { 
        color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        chipColor: 'success'
      },
      'Rare': { 
        color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        chipColor: 'primary'
      },
      'Epic': { 
        color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        chipColor: 'secondary'
      },
      'Legendary': { 
        color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        chipColor: 'warning'
      },
      'Artifact': { 
        color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        chipColor: 'error'
      }
    };
    return rarityMap[rarity] || rarityMap['Common'];
  };

  // Get equipment type icon
  const getEquipmentIcon = (type) => {
    const iconMap = {
      'Head': '🪖',
      'Chest': '🛡️',
      'Arms': '🥽',
      'Legs': '👖',
      'Feet': '🥾'
    };
    return iconMap[type] || '🛡️';
  };

  const rarityInfo = getRarityInfo(props.currArmor.rarity);
  const isAdmin = localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN';
  const isHidden = props.currArmor.hidden === 'Yes';
  const hasAnomalousEffect = props.currArmor.anomalousEffect !== "None";

  const StatRow = ({ icon, label, value, highlight = false }) => (
    <Box 
      display="flex" 
      alignItems="center" 
      justifyContent="space-between"
      sx={{ 
        py: 0.5,
        px: 1,
        borderRadius: 1,
        bgcolor: highlight ? 'rgba(255,255,255,0.1)' : 'transparent'
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        {icon}
        <Typography variant="body2" color="rgba(255,255,255,0.9)">
          {label}:
        </Typography>
      </Box>
      <Typography 
        variant="body2" 
        fontWeight={highlight ? "bold" : "normal"}
        color="white"
      >
        {value}
      </Typography>
    </Box>
  );

  const flipArmor = () => {
    updateDoc(doc(db, 'Armor', props.currArmor.name), {
      hidden: props.currArmor.hidden === 'Yes' ? 'No' : 'Yes'
    })
  }

  return (
    <>
      <Fade in timeout={500}>
        <Card
          elevation={8}
          sx={{
            width: { xs: '100%', md: '420px' },
            height: '400px',
            borderRadius: 4,
            background: rarityInfo.color,
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
                {getEquipmentIcon(props.currArmor.equippedTo)}
              </Avatar>
            }
            title={
              <Typography variant="h5" fontWeight="bold" color="white">
                {props.currArmor.name}
              </Typography>
            }
            subheader={
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5} sx={{ mt: 1 }}>
                <Chip
                  icon={<StarRate />}
                  label={props.currArmor.rarity}
                  size="small"
                  color={rarityInfo.chipColor}
                  sx={{ fontWeight: 'bold' }}
                />
                <Chip
                  label={props.currArmor.equippedTo}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white'
                  }}
                />
                <Chip
                  icon={<AttachMoney />}
                  label={props.currArmor.price}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white'
                  }}
                />
                {hasAnomalousEffect && (
                  <Chip
                    icon={<AutoAwesome />}
                    label="Anomalous"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255, 215, 0, 0.3)',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                )}
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
                {props.currArmor.description}
              </Typography>
            </Paper>

            {/* Stats */}
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                borderRadius: 2,
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="white" sx={{ mb: 1 }}>
                <Shield sx={{ mr: 1, verticalAlign: 'middle' }} />
                Armor Statistics
              </Typography>
              
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <StatRow 
                    icon={<Build fontSize="small" />}
                    label="Repair"
                    value={props.currArmor.repairSkill}
                  />
                  <StatRow 
                    icon={<Security fontSize="small" />}
                    label="Durability"
                    value={props.currArmor.durability}
                  />
                  <StatRow 
                    icon={<Shield fontSize="small" />}
                    label="Melee Defense"
                    value={defenses[0]}
                    highlight
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatRow 
                    icon={<Shield fontSize="small" />}
                    label="Ranged Defense"
                    value={defenses[1]}
                    highlight
                  />
                  <StatRow 
                    icon={<Security fontSize="small" />}
                    label="Soak"
                    value={props.currArmor.soak}
                    highlight
                  />
                  <StatRow 
                    icon={<FitnessCenter fontSize="small" />}
                    label="Encumbrance"
                    value={props.currArmor.encumbrance}
                  />
                </Grid>
              </Grid>

              {/* Specials */}
              {specials.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="white" sx={{ mb: 1 }}>
                    Special Properties:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {specials.map((special, index) => (
                      <Chip
                        key={index}
                        label={special}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: 'white'
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Set Bonus */}
              {props.currArmor.setBonus && props.currArmor.setBonus !== "None" && (
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', mb: 1 }} />
                  <Typography variant="subtitle2" fontWeight="bold" color="white">
                    Set Bonus: {props.currArmor.setBonus}
                  </Typography>
                </Box>
              )}
            </Paper>
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
            {hasAnomalousEffect && (
              <Button
                onClick={() => setAnomalousDisplayed(true)}
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
                Anomalous Effect
              </Button>
            )}
            
            {isAdmin && (
              <Button
                onClick={flipArmor}
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
                {isHidden ? 'Show' : 'Hide'} Armor
              </Button>
            )}
          </Box>
        </Card>
      </Fade>

      {/* Enhanced Anomalous Effect Dialog */}
      <Dialog 
        open={anomalousDisplayed} 
        onClose={() => setAnomalousDisplayed(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: rarityInfo.color,
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
              {props.currArmor.name} - Anomalous Effect
            </Typography>
          </Box>
          <IconButton
            onClick={() => setAnomalousDisplayed(false)}
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ p: 3 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Typography 
              variant="body1" 
              color="white"
              sx={{ lineHeight: 1.8 }}
            >
              {props.currArmor.anomalousEffect}
            </Typography>
          </Paper>
        </Box>
      </Dialog>
    </>
  )
}