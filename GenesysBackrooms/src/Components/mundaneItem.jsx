import { Box, Button, Card, Chip, Typography, CardContent,CardHeader,Stack,Paper,Fade,Avatar } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import db from '../Components/firebase';
import { AttachMoney,Visibility,VisibilityOff,StarRate,Group,Category } from '@mui/icons-material';

export default function MundaneItem(props) {
  const usedBy = props.currMundane.usedBy 
    ? props.currMundane.usedBy.split("/").filter(Boolean)
    : [];
  
  // Get rarity color and gradient (same system as weapons/armor)
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

  // Get item category icon based on common item types
  const getItemIcon = (name) => {
    const itemName = name.toLowerCase();
    if (itemName.includes('book') || itemName.includes('tome') || itemName.includes('manual')) return '📚';
    if (itemName.includes('tool') || itemName.includes('kit')) return '🛠️';
    if (itemName.includes('potion') || itemName.includes('vial') || itemName.includes('bottle')) return '🧪';
    if (itemName.includes('key') || itemName.includes('lock')) return '🗝️';
    if (itemName.includes('rope') || itemName.includes('chain')) return '🪢';
    if (itemName.includes('torch') || itemName.includes('lantern') || itemName.includes('light')) return '🔦';
    if (itemName.includes('bag') || itemName.includes('pack') || itemName.includes('container')) return '🎒';
    if (itemName.includes('coin') || itemName.includes('gold') || itemName.includes('silver')) return '🪙';
    if (itemName.includes('gem') || itemName.includes('jewel') || itemName.includes('crystal')) return '💎';
    if (itemName.includes('scroll') || itemName.includes('parchment')) return '📜';
    return '📦'; // Default generic item
  };

  const rarityInfo = getRarityInfo(props.currMundane.rarity);
  const isAdmin = localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN';
  const isHidden = props.currMundane.hidden === 'Yes';
  
  const flipHidden = () => {
    updateDoc(doc(db, 'MundaneObjects', props.currMundane.name), {
      hidden: props.currMundane.hidden === 'Yes' ? 'No' : 'Yes'
    })
  }

  return (
    <Fade in timeout={500}>
      <Card 
        elevation={8}
        sx={{
          width: { xs: '100%', md: '420px' },
          height: '350px',
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
              {getItemIcon(props.currMundane.name)}
            </Avatar>
          }
          title={
            <Typography variant="h5" fontWeight="bold" color="white">
              {props.currMundane.name}
            </Typography>
          }
          subheader={
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5} sx={{ mt: 1 }}>
              <Chip
                icon={<StarRate />}
                label={props.currMundane.rarity}
                size="small"
                color={rarityInfo.chipColor}
                sx={{ fontWeight: 'bold' }}
              />
              <Chip
                icon={<AttachMoney />}
                label={props.currMundane.price}
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white'
                }}
              />
              <Chip
                icon={<Category />}
                label="Mundane Item"
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
          height: 'calc(100% - 120px)', 
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
              {props.currMundane.description}
            </Typography>
          </Paper>

          {/* Used By Section */}
          {usedBy.length > 0 && (
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                borderRadius: 2,
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Group />
                <Typography variant="h6" fontWeight="bold" color="white">
                  Used By
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {usedBy.map((user, index) => (
                  <Chip
                    key={index}
                    label={user}
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
            </Paper>
          )}
        </CardContent>

        {/* Admin Button */}
        {isAdmin && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              right: 12,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
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
              {isHidden ? 'Show' : 'Hide'} Object
            </Button>
          </Box>
        )}

        {/* Decorative Bottom Accent */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'rgba(255,255,255,0.3)'
          }}
        />
      </Card>
    </Fade>
  )
}