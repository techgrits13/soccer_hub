require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

const app = express();
app.use(express.json());
const port = process.env.PORT || 8000;

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase URL or Key. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());

// Example route
app.get('/', (req, res) => {
  res.send('Soccer Hub Backend is running!');
});

// Example route to get data from Supabase
app.get('/users', async (req, res) => {
  const { data, error } = await supabase
    .from('users') // Assumes you have a 'users' table
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

const Parser = require('rss-parser');
const parser = new Parser();

const feedUrls = [
  // Original Feeds
  'https://101greatgoals.com/feed',
  'https://www.90min.com/posts.rss',
  'https://www.eyefootball.com/rss',
  'https://www.soccernews.com/feed',
  'https://caughtoffside.com/feed',
  'https://sportslens.com/feed',
  'https://footballfancast.com/feed',
  'https://fourfourtwo.com/feed',
  'https://worldsoccer.com/feed',
  'https://football-italia.net/feed',
  'https://feeds.bbci.co.uk/sport/football/rss.xml',
  'https://ghanasoccernet.com/rss',

  // Newly Added Feeds
  // Premier League
  'https://www.football.london/?service=rss',
  'https://www.football.london/arsenal-fc/?service=rss',
  'https://www.football.london/chelsea-fc/?service=rss',
  'https://www.football.london/tottenham-hotspur-fc/?service=rss',
  'https://football-talk.co.uk/topics/premier-league/feed/',
  'https://e00-marca.uecdn.es/rss/en/football/premier-league.xml',
  'https://talksport.com/football/premier-league/feed/',
  'https://feeds.thescore.com/epl.rss',
  'https://www.liverpool.com/liverpool-fc-news/?service=rss',

  // La Liga
  'https://laligaexpert.com/feed/',
  'https://ligafever.com/feed/',
  'https://e00-marca.uecdn.es/rss/en/football/spanish-football.xml',
  'https://www.football-espana.net/category/la-liga/feed',
  'https://www.theguardian.com/football/laligafootball/rss',

  // General & Other
  'https://playmakerstats.com/rss.php',
];

app.get('/api/feeds', async (req, res) => {
  console.log('Fetching RSS feeds...');
  try {
    const feedPromises = feedUrls.map(url => parser.parseURL(url).catch(err => {
      console.error(`Failed to fetch or parse ${url}:`, err.message);
      return null; // Return null for failed feeds
    }));
    
    const feeds = (await Promise.all(feedPromises)).filter(feed => feed !== null);

    let allItems = [];
    feeds.forEach(feed => {
      if (feed && feed.items) {
        feed.items.forEach(item => {
          // Function to find the best image URL from various possible fields
          const getImageUrl = (item) => {
            if (item.enclosure && item.enclosure.url) {
              return item.enclosure.url;
            }
            if (item['media:content'] && item['media:content'].$.url) {
              return item['media:content'].$.url;
            }
            // Fallback to parsing the HTML content for the first <img> tag
            if (item.content) {
              const match = item.content.match(/<img[^>]+src="([^">]+)"/);
              if (match) return match[1];
            }
            return null; // Return null if no image is found
          };

          allItems.push({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            isoDate: item.isoDate,
            creator: item.creator || item['dc:creator'],
            snippet: item.contentSnippet,
            source: feed.title,
            imageUrl: getImageUrl(item),
          });
        });
      }
    });

    // Sort all items by date, newest first
    allItems.sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate));

    console.log(`Successfully fetched and combined ${allItems.length} articles.`);
    res.json(allItems);

  } catch (error) {
    console.error('Error in /api/feeds:', error);
    res.status(500).json({ error: 'Failed to fetch news feeds.' });
  }
});

app.get('/api/fixtures', async (req, res) => {
  console.log('Fetching upcoming fixtures...');

  try {
    const feed = await parser.parseURL('https://playmakerstats.com/rss.php').catch(error => {
      console.error('Failed to parse fixtures feed:', error.message);
      return null;
    });

    if (!feed || !Array.isArray(feed.items)) {
      console.warn('Fixtures feed unavailable or malformed. Returning empty list.');
      return res.json([]);
    }

    const twentyFourHoursFromNow = new Date();
    twentyFourHoursFromNow.setDate(twentyFourHoursFromNow.getDate() + 1);

    const upcomingFixtures = feed.items
      .filter(item => {
        try {
          const itemDate = new Date(item.isoDate);
          return itemDate > new Date() && itemDate < twentyFourHoursFromNow;
        } catch {
          return false;
        }
      })
      .map(item => ({
        title: item.title,
        date: item.isoDate,
        link: item.link,
      }));

    console.log(`Found ${upcomingFixtures.length} fixtures in the next 24 hours.`);
    res.json(upcomingFixtures);

  } catch (error) {
    console.error('Unexpected error in /api/fixtures:', error);
    res.json([]);
  }
});

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: { "HTTP-Referer": "http://localhost:3000" },
});

app.post('/api/predict', async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Match title is required.' });
  }

  console.log(`Generating prediction for: ${title}`);

  try {
    const completion = await openrouter.chat.completions.create({
      model: 'deepseek/deepseek-coder',
      messages: [
        {
          role: 'system',
          content: 'You are a football analyst. Predict the outcome of a match. Provide odds, predicted score, and a brief analysis. Format the response as a simple JSON object with keys: odds, predictedScore, and analysis.'
        },
        {
          role: 'user',
          content: `Predict the outcome of this match: ${title}`
        }
      ],
    });

    const prediction = JSON.parse(completion.choices[0].message.content);
    res.json(prediction);

  } catch (error) {
    console.error('Error generating prediction:', error);
    res.status(500).json({ error: 'Failed to generate prediction.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
