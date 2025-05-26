import { Box, Card, Divider, Stack, Typography, Chip,Paper,CardContent, Button } from "@mui/material";

export default function GroupItem(props) {
  const group = props.currGroup;
  
  return (
    <Card variant="outlined" sx={{width: { xs: '100%', md: '600px' }, border: '2px solid #e0e0e0',borderRadius: 2,overflow: 'auto', height: '615px',boxShadow: 3,'&:hover': {boxShadow: 6,borderColor: '#1976d2'}}}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{fontWeight: 'bold',color: 'primary.main',mb: 1}}>{group.name}</Typography>
          {group.link && (<Button variant="contained" size="small" href={group.link} target="_blank" rel="noopener noreferrer" sx={{ mb: 1 }}>View Documentation</Button>)}
        </Box>
        <Box sx={{ mb: 3 }}>
          <Divider sx={{ mb: 2 }}>
            <Chip label="Our Goal" color="primary" variant="outlined" />
          </Divider>
          <Paper elevation={1} sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>{group.primaryGoal}</Typography>
          </Paper>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Divider sx={{ mb: 2 }}>
            <Chip label="Relations" color="secondary" variant="outlined" />
          </Divider>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {group.relations.map((relation, index) => (
              <Chip key={index} label={relation} variant="filled" size="small"color="secondary"/>
            ))}
          </Box>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Divider sx={{ mb: 2 }}>
            <Chip label="Subgroups" color="info" variant="outlined" />
          </Divider>
          <Stack spacing={2}>
            {group.subGroups.map((subgroup, index) => (
              <Paper key={index} elevation={2} sx={{ p: 2, borderLeft: 4, borderColor: 'info.main', backgroundColor: '#f0f8ff'}}>
                <Typography variant="h6" sx={{fontWeight: 'bold', mb: 1, color: 'info.dark'}}>{subgroup.name}</Typography>
                <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.5 }}>{subgroup.function.split(',').join('. ')}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium',color: 'text.secondary'}}>Lead by {subgroup.leader}</Typography>
              </Paper>
            ))}
          </Stack>
        </Box>
        <Box>
          <Divider sx={{ mb: 2 }}>
            <Chip label="Outposts" color="success" variant="outlined" />
          </Divider>
          <Stack spacing={2}>
            {group.outposts.map((outpost, index) => (
              <Paper key={index} elevation={2} sx={{ p: 2, borderLeft: 4, borderColor: 'success.main',backgroundColor: '#f0fff4'}}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1,color: 'success.dark'}}>{outpost.name}</Typography>
                <Stack spacing={0.5}>
                  <Typography variant="body2"><strong>Status:</strong> {outpost.status}</Typography>
                  <Typography variant="body2"><strong>Function:</strong> {outpost.function}</Typography>
                  <Typography variant="body2"><strong>Population:</strong> {outpost.population}</Typography>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}