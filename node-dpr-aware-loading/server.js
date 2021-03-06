/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const express = require('express');
const path = require('path');
const request = require('request');

const PORT = parseInt(process.env.PORT, 10) || 5000;
const BUILD_PATH ='build';

const app = express();
app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, BUILD_PATH)));
app.set('views', `${__dirname}/${BUILD_PATH}`);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('/dpr-aware-image', (req, res) => {
  console.log('[server dpr-aware-image request] DPR => ', req.headers.dpr);
  const dpr = req.headers.dpr || 1;
  const url = `https://via.placeholder.com/${dpr * 400}/92c952`;
  
  try {
    request.get(url).pipe(res);
  } catch (error) {
    console.log('[server dpr-aware-image request proxy] error => ', error);
    res.status(500).json({
      message: error
    });
  }
});

// need to declare a "catch all" route on your express server 
// that captures all page requests and directs them to the client
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, BUILD_PATH, 'index.html'));
});

app.listen(
  PORT,
  () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  }
);
