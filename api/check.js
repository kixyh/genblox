export default async function handler(req, res) {
  // Allow requests from your frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username parameter is required' });
  }

  try {
    // Query Roblox official API to check availability
    const response = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernames: [username],
        excludeBannedUsers: true
      })
    });

    const data = await response.json();
    
    // If Roblox returns match data, the username is already taken
    const isTaken = data.data && data.data.length > 0;

    return res.status(200).json({
      username: username,
      available: !isTaken
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to connect to Roblox API' });
  }
}
