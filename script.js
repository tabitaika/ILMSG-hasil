function loadFolder(folderName) {
  const base = `data/${folderName}/`;
  const prefixes = ["P06", "P04", "P08", "P03", "Pria", "Wanita"];
  const content = document.getElementById("content");
  
  // Map folder names to metricsData keys
  const folderNameMap = {
    'LSTM': 'LSTM',
    'BiLSTM(57)': 'BiLSTM',
    '4Head(45)': 'BiLSTM4Head',
    '8Head(46)': 'BiLSTM8Head'
  };
  
  const metricsData = {
    LSTM: {
      P06: { PESQ: 1.0323, STOI: 0.0582, ESTOI: 0.3133 },
      P04: { PESQ: 1.0326, STOI: 0.0429, ESTOI: 0.3019 },
      P08: { PESQ: 1.0619, STOI: 0.0794, ESTOI: 0.3233 },
      P03: { PESQ: 1.0322, STOI: 0.0433, ESTOI: 0.2172 },
      Pria: { PESQ: 1.0319, STOI: 0.4904, ESTOI: 0.2518 },
      Wanita: { PESQ: 1.1711, STOI: 0.5850, ESTOI: 0.4023 },
    },
    BiLSTM: {
      P06: { PESQ: 1.163, STOI: 0.5352, ESTOI: 0.3399 },
      P04: { PESQ: 1.180, STOI: 0.5598, ESTOI: 0.3177 },
      P08: { PESQ: 1.272, STOI: 0.5310, ESTOI: 0.3443 },
      P03: { PESQ: 1.218, STOI: 0.4526, ESTOI: 0.2982 },
      Pria: { PESQ: 1.152, STOI: 0.5309, ESTOI: 0.2904 },
      Wanita: { PESQ: 1.205, STOI: 0.6105, ESTOI: 0.4308 },
    },
    BiLSTM4Head: {
      P06: { PESQ: 1.153, STOI: 0.5248, ESTOI: 0.3273 },
      P04: { PESQ: 1.183, STOI: 0.5614, ESTOI: 0.3112 },
      P08: { PESQ: 1.272, STOI: 0.5259, ESTOI: 0.3423 },
      P03: { PESQ: 1.209, STOI: 0.4457, ESTOI: 0.2949 },
      Pria: { PESQ: 1.150, STOI: 0.5318, ESTOI: 0.2889 },
      Wanita: { PESQ: 1.214, STOI: 0.6113, ESTOI: 0.4329 },
    },
    BiLSTM8Head: {
      P06: { PESQ: 1.152, STOI: 0.5310, ESTOI: 0.3341 },
      P04: { PESQ: 1.118, STOI: 0.4119, ESTOI: 0.1933 },
      P08: { PESQ: 1.262, STOI: 0.5297, ESTOI: 0.3449 },
      P03: { PESQ: 1.203, STOI: 0.4301, ESTOI: 0.2825 },
      Pria: { PESQ: 1.154, STOI: 0.5354, ESTOI: 0.2934 },
      Wanita: { PESQ: 1.210, STOI: 0.6119, ESTOI: 0.4330 },
    }
  };

  let html = "";

  // Train Loss
  html += `<div class="row">`;
  prefixes.forEach(prefix => {
    html += `
      <div class="column">
        <h3>Train Loss - ${prefix}</h3>
        <img src="${base}${prefix}_TrainLoss.png" alt="Train Loss ${prefix}">
      </div>`;
  });
  html += `</div>`;

  // Val Loss
  html += `<div class="row">`;
  prefixes.forEach(prefix => {
    html += `
      <div class="column">
        <h3>Val Loss - ${prefix}</h3>
        <img src="${base}${prefix}_ValLoss.png" alt="Val Loss ${prefix}">
      </div>`;
  });
  html += `</div>`;

  // Mel Spectrogram
  html += `<div class="row">`;
  prefixes.forEach(prefix => {
    html += `
      <div class="column">
        <h3>Mel Spectrogram - ${prefix}</h3>
        <img src="${base}${prefix}_MelSpectogram.png" alt="Mel Spectrogram ${prefix}">
      </div>`;
  });
  html += `</div>`;

  // Original Sound
  html += `<div class="row">`;
  prefixes.forEach(prefix => {
    html += `
      <div class="column">
        <h3>Original Sound - ${prefix}</h3>
        <div class="audio-container">
          <audio controls id="audio-gt-${prefix}">
            <source src="${base}${prefix}_GT_1.wav" type="audio/wav">
            Browser tidak mendukung audio.
          </audio>
          <canvas class="waveform-canvas" id="waveform-gt-${prefix}"></canvas>
        </div>
      </div>`;
  });
  html += `</div>`;

  // Predicted Sound
  html += `<div class="row">`;
  prefixes.forEach(prefix => {
    html += `
      <div class="column">
        <h3>Predicted Sound - ${prefix}</h3>
        <div class="audio-container">
          <audio controls id="audio-pred-${prefix}">
            <source src="${base}${prefix}_P_1.wav" type="audio/wav">
            Browser tidak mendukung audio.
          </audio>
          <canvas class="waveform-canvas" id="waveform-pred-${prefix}"></canvas>
        </div>
      </div>`;
  });
  html += `</div>`;

  // Scores (PESQ, STOI, ESTOI, MSE)
  const scores = ["PESQ", "STOI", "ESTOI"];
  scores.forEach(score => {
    html += `<div class="row">`;
    prefixes.forEach(prefix => {
      html += `
        <div class="column">
          <h3>${score} - ${prefix}</h3>
          <div id="${prefix}_${score}">Loading..</div>
        </div>`;
    });
    html += `</div>`;
  });

  content.innerHTML = html;
  
  // Load waveforms after content is set
  prefixes.forEach(prefix => {
    loadWaveform(`${base}${prefix}_GT_1.wav`, `waveform-gt-${prefix}`);
    loadWaveform(`${base}${prefix}_P_1.wav`, `waveform-pred-${prefix}`);
  });
  
  // Update nilai dari metricsData
  const dataKey = folderNameMap[folderName];
  const data = metricsData[dataKey];
  if (data) {
    prefixes.forEach(prefix => {
      const metric = data[prefix];
      if (metric) {
        ["PESQ", "STOI", "ESTOI"].forEach(score => {
          const el = document.getElementById(`${prefix}_${score}`);
          if (el && metric[score] !== undefined) {
            el.innerText = metric[score].toFixed(4);  // dibulatkan 4 digit
          }
        });
      }
    });
  }
}

async function loadWaveform(audioUrl, canvasId) {
  try {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    drawWaveform(canvas, ctx, audioBuffer);
  } catch (error) {
    console.log(`Could not load waveform for ${audioUrl}:`, error);
  }
}

function drawWaveform(canvas, ctx, audioBuffer) {
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = canvas.offsetHeight;
  
  ctx.clearRect(0, 0, width, height);
  
  const data = audioBuffer.getChannelData(0);
  const step = Math.ceil(data.length / width);
  const amp = height / 2;
  
  ctx.fillStyle = '#007bff';
  ctx.strokeStyle = '#007bff';
  ctx.lineWidth = 1;
  
  ctx.beginPath();
  ctx.moveTo(0, amp);
  
  for (let i = 0; i < width; i++) {
    let min = 1.0;
    let max = -1.0;
    
    for (let j = 0; j < step; j++) {
      const datum = data[(i * step) + j];
      if (datum < min) min = datum;
      if (datum > max) max = datum;
    }
    
    const yMin = (1 + min) * amp;
    const yMax = (1 + max) * amp;
    
    ctx.fillRect(i, yMin, 1, yMax - yMin);
  }
}
