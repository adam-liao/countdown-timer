function createTimer(timerId) {
  const container = document.querySelector(`.timer[data-id='${timerId}']`);
  const nameKey = `eventName${timerId}`;
  const timeKey = `eventTime${timerId}`;

  const savedName = localStorage.getItem(nameKey);
  const savedTime = localStorage.getItem(timeKey);

  if (savedName && savedTime) {
    showCountdown(container, savedName, savedTime, nameKey, timeKey);
  } else {
    showInputForm(container, nameKey, timeKey);
  }
}

function showInputForm(container, nameKey, timeKey) {
  container.innerHTML = `
    <h3>設定第 ${nameKey.slice(-1)} 組計時</h3>
    <label>計時名稱：<input type="text" id="name-${nameKey}" /></label><br/>
    <label>目標時間：<input type="datetime-local" id="time-${timeKey}" /></label><br/>
    <button onclick="saveTimer('${nameKey}', '${timeKey}')">開始倒數</button>
  `;
}

function saveTimer(nameKey, timeKey) {
  const name = document.getElementById(`name-${nameKey}`).value;
  const time = document.getElementById(`time-${timeKey}`).value;

  if (!name || !time) {
    alert("請輸入完整資訊！");
    return;
  }

  localStorage.setItem(nameKey, name);
  localStorage.setItem(timeKey, time);
  location.reload();
}

function showCountdown(container, name, time, nameKey, timeKey) {
  const targetDate = new Date(time);
  container.innerHTML = `
    <h3>${name} 倒數</h3>
    <div class="time-left" id="left-${nameKey}">計算中...</div>
    <button onclick="resetTimer('${nameKey}', '${timeKey}')">重設</button>
  `;

  function update() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.getElementById(`left-${nameKey}`).innerText = `恭喜達成：${name}`;
      clearInterval(interval);
      return;
    }

    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours   = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const leftDays = (days % 365) % 30;

    // document.getElementById(`left-${nameKey}`).innerText =
    //   `${pad(years)} 年 ${pad(months)} 月 ${pad(leftDays)} 天 ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    let result = "";

// 只有在年 > 0 時顯示年
if (years > 0) result += `${pad(years)} 年 `;

// 月 > 0 或 年 > 0 才顯示月
if (months > 0 || years > 0) result += `${pad(months)} 月 `;

// 日 > 0 或 上面有年月，才顯示日
if (leftDays > 0 || months > 0 || years > 0) result += `${pad(leftDays)} 天 `;

// 時 > 0 或有更高單位時才顯示
if (hours > 0 || leftDays > 0 || months > 0 || years > 0) result += `${pad(hours)} 小時 `;

// 分 > 0 或有更高單位時才顯示
if (minutes > 0 || hours > 0 || leftDays > 0 || months > 0 || years > 0) result += `${pad(minutes)} 分 `;

// 秒永遠顯示
result += `${pad(seconds)} 秒`;

document.getElementById(`left-${nameKey}`).innerText = result;F
  }

  function pad(n) {
    return n.toString().padStart(2, '0');
  }

  update();
  const interval = setInterval(update, 1000);
}

function resetTimer(nameKey, timeKey) {
  localStorage.removeItem(nameKey);
  localStorage.removeItem(timeKey);
  location.reload();
}

// 主題切換
function changeTheme() {
  const theme = document.getElementById("themeSelect").value;
  document.body.className = theme;
  localStorage.setItem("theme", theme);
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "white";
  document.body.className = savedTheme;
  document.getElementById("themeSelect").value = savedTheme;
}

// 初始化
loadTheme();
for (let i = 1; i <= 3; i++) {
  createTimer(i);
}