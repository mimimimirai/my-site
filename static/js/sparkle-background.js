// スターダストアニメーション（ダークモード専用）
(function() {
  'use strict';
  
  let canvas = null;
  let ctx = null;
  let animationId = null;
  let particles = [];
  let flakes = [];
  let konpeitos = [];
  let width = 0;
  let height = 0;
  
  // ダークモードかどうかを判定する関数
  function isDarkMode() {
    return document.documentElement.classList.contains('dark');
  }
  
  // Canvas要素を作成
  function createCanvas() {
    if (canvas) return;
    
    if (!document.body) return;
    
    canvas = document.createElement('canvas');
    canvas.id = 'sparkle-background';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.display = 'none';
    document.body.appendChild(canvas);
    
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }
  
  // Canvasサイズを設定
  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
    }
  }
  
  // パーティクルのクラス
  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * height;
      this.x = Math.random() * width;
    }
    
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.life = Math.random();
      this.lifeSpeed = Math.random() * 0.005 + 0.002;
      this.type = Math.random() > 0.7 ? 'star' : Math.random() > 0.5 ? 'dot' : 'trail';
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life += this.lifeSpeed;
      
      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
      }
      
      if (this.life > 1) {
        this.reset();
      }
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity * (1 - Math.abs(this.life - 0.5) * 2);
      
      if (this.type === 'star') {
        const size = this.size * 2;
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-size / 2, -size / 2, size, size);
      } else if (this.type === 'dot') {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = this.size;
        ctx.beginPath();
        ctx.moveTo(this.x - this.speedX * 10, this.y - this.speedY * 10);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
      }
      
      ctx.restore();
    }
  }
  
  // 細長い形状（花びらのような）のクラス
  class Flake {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 15 + 5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = Math.random() * 0.5 + 0.2;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      this.opacity = Math.random() * 0.4 + 0.2;
      this.life = Math.random();
      this.lifeSpeed = Math.random() * 0.003 + 0.001;
      // ピンクやオレンジ系の色をランダムに設定
      const colorVariation = Math.random();
      if (colorVariation < 0.5) {
        // ピンク系
        this.colorR = 255;
        this.colorG = 180 + Math.random() * 30; // 180-210
        this.colorB = 180 + Math.random() * 40; // 180-220
      } else {
        // オレンジ系
        this.colorR = 255;
        this.colorG = 160 + Math.random() * 40; // 160-200
        this.colorB = 120 + Math.random() * 50; // 120-170
      }
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      this.life += this.lifeSpeed;
      
      if (this.x < -20 || this.x > width + 20 || this.y > height + 20) {
        this.reset();
        this.y = -20;
      }
      
      if (this.life > 1) {
        this.reset();
      }
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity * (1 - Math.abs(this.life - 0.5) * 2);
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      // ピンクやオレンジ系の色を使用
      ctx.fillStyle = `rgba(${Math.floor(this.colorR)}, ${Math.floor(this.colorG)}, ${Math.floor(this.colorB)}, 0.6)`;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size / 2, this.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  
  // 金平糖のような形のクラス
  class Konpeito {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 5 + 3; // 楕円より小さく（3-8）
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.03;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.life = Math.random();
      this.lifeSpeed = Math.random() * 0.004 + 0.002;
      // 角の数（5-8角形）
      this.points = Math.floor(Math.random() * 4) + 5;
      // 色をランダムに設定（ピンク、オレンジ、白系）
      const colorType = Math.random();
      if (colorType < 0.4) {
        // ピンク系
        this.colorR = 255;
        this.colorG = 180 + Math.random() * 30;
        this.colorB = 180 + Math.random() * 40;
      } else if (colorType < 0.8) {
        // オレンジ系
        this.colorR = 255;
        this.colorG = 160 + Math.random() * 40;
        this.colorB = 120 + Math.random() * 50;
      } else {
        // 白系（少しピンクがかった）
        this.colorR = 240 + Math.random() * 15;
        this.colorG = 230 + Math.random() * 25;
        this.colorB = 240 + Math.random() * 15;
      }
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      this.life += this.lifeSpeed;
      
      if (this.x < -20 || this.x > width + 20 || this.y < 0 || this.y > height + 20) {
        this.reset();
        if (this.y > height + 20) {
          this.y = -20;
        }
      }
      
      if (this.life > 1) {
        this.reset();
      }
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity * (1 - Math.abs(this.life - 0.5) * 2);
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      
      // 金平糖のような形を描画（多角形の各頂点を外側に伸ばす）
      const radius = this.size;
      const spikeLength = radius * 0.3; // 突起の長さ
      ctx.beginPath();
      
      for (let i = 0; i < this.points * 2; i++) {
        const angle = (Math.PI * 2 * i) / (this.points * 2);
        let r;
        if (i % 2 === 0) {
          // 外側の頂点（突起）
          r = radius + spikeLength;
        } else {
          // 内側の頂点
          r = radius * 0.6;
        }
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      
      ctx.closePath();
      ctx.fillStyle = `rgba(${Math.floor(this.colorR)}, ${Math.floor(this.colorG)}, ${Math.floor(this.colorB)}, 0.7)`;
      ctx.fill();
      
      // 少し光沢を追加
      ctx.strokeStyle = `rgba(${Math.floor(this.colorR)}, ${Math.floor(this.colorG)}, ${Math.floor(this.colorB)}, 0.4)`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      
      ctx.restore();
    }
  }
  
  // パーティクルとフレーク、金平糖を初期化
  function initParticles() {
    particles = [];
    flakes = [];
    konpeitos = [];
    const particleCount = 150;
    const flakeCount = 20;
    const konpeitoCount = 30; // 金平糖の数
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    for (let i = 0; i < flakeCount; i++) {
      flakes.push(new Flake());
    }
    
    for (let i = 0; i < konpeitoCount; i++) {
      konpeitos.push(new Konpeito());
    }
  }
  
  // アニメーションループ
  function animate() {
    if (!canvas || !ctx) return;
    
    if (!isDarkMode()) {
      stopAnimation();
      return;
    }
    
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    flakes.forEach(flake => {
      flake.update();
      flake.draw();
    });
    
    // 金平糖を更新・描画
    konpeitos.forEach(konpeito => {
      konpeito.update();
      konpeito.draw();
    });
    
    animationId = requestAnimationFrame(animate);
  }
  
  // アニメーションを開始
  function startAnimation() {
    if (!isDarkMode()) return;
    
    if (!document.body) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startAnimation);
      } else {
        setTimeout(startAnimation, 50);
      }
      return;
    }
    
    createCanvas();
    if (!canvas || !ctx) {
      setTimeout(startAnimation, 50);
      return;
    }
    
    resizeCanvas();
    initParticles();
    
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    
    canvas.style.display = 'block';
    animate();
  }
  
  // アニメーションを停止
  function stopAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    if (canvas) {
      canvas.style.display = 'none';
    }
  }
  
  // テーマ切り替えを監視
  function handleThemeChange() {
    setTimeout(() => {
      if (isDarkMode()) {
        startAnimation();
      } else {
        stopAnimation();
      }
    }, 50);
  }
  
  // 初期化
  function init() {
    // MutationObserverでdarkクラスの変更を監視
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    // テーマ切り替えボタンのクリックイベントも監視
    const setupSwitchers = () => {
      const switcher = document.getElementById('appearance-switcher');
      const switcherMobile = document.getElementById('appearance-switcher-mobile');
      
      if (switcher) {
        switcher.addEventListener('click', handleThemeChange);
      }
      
      if (switcherMobile) {
        switcherMobile.addEventListener('click', handleThemeChange);
      }
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupSwitchers);
    } else {
      setupSwitchers();
    }
    
    // 初期状態でダークモードならアニメーションを開始
    setTimeout(() => {
      if (isDarkMode()) {
        startAnimation();
      }
    }, 200);
  }
  
  // 初期化を開始
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
