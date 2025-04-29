Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },
  data: {
    selectedEmotion: null,
    emotionTexts: {
      veryHappy: [
        "哇哦！你看起来像个小太阳🌞，照亮了所有人！",
        "今天的心情比彩虹还要绚烂🌈，继续保持哦！",
        "你的笑容比蜜还甜🍯，希望每天都这么开心！",
        "心情好到爆表💥，感觉能飞上天和太阳肩并肩！",
        "看到你这么开心，我都跟着乐开花了🌸",
        "幸福就像小尾巴一样追着你跑呢🐾，太棒了！",
        "快乐是会传染的，你就是那个超级传播者🤩",
        "愿你的每一天都像过节一样开心🎉",
        "你的正能量满满⚡，简直是个移动的小确幸！",
        "今天的生活因为有你而更美好💖"
      ],
      happy: [
        "开心的日子总是过得特别快，但快乐可以延续呀😊",
        "保持这份快乐吧，生活处处都有惊喜🎁",
        "微笑是最美的妆容，你今天美极了✨",
        "快乐是一种选择，而你选择了最正确的那一个👍",
        "小小的幸福积累起来，就成了大大的满足🤗",
        "每天找到一个小确幸，生活就会充满阳光☀️",
        "乐观是你最好的朋友，陪你走过每一个美好的瞬间🌟",
        "用一颗感恩的心去感受生活中的每一份快乐💕",
        "记住，笑一笑，没有什么过不去的坎😄",
        "快乐其实很简单，就像你现在这样就很好😉"
      ],
      slightlyHappy: [
        "一点点的快乐也是快乐，让我们珍惜这小小的幸福😊",
        "微笑是最好的状态，让世界因你而更美好🌸",
        "即使是小小的喜悦，也能点亮整个日子💡",
        "小小的快乐积累起来，也能变成巨大的幸福🌟",
        "今天的你有着淡淡的幸福感，真不错🥰",
        "不要忽视那些微小的快乐，它们往往最能打动人心💖",
        "即使是轻轻的一笑，也能让周围的人感到温暖🌞",
        "每个小小的心动，都是幸福的开始💫",
        "感受到内心的温暖了吗？那是快乐在靠近🤗",
        "愿这些小小的快乐，成为你生活的调味剂🧂"
      ],
      neutral: [
        "平静如水的心态也是一种智慧，让你看事更清晰🧐",
        "平和的心态让我们更清晰地看待事物，真好😌",
        "内心平静如湖面，能够映照出世界的美丽🌅",
        "有时候，静下来思考，你会发现不一样的视角🔍",
        "不悲不喜的状态，其实也是一种难得的境界🧘‍♂️",
        "保持一颗平常心，面对人生的起起落落🌊",
        "平静之中蕴含着力量，等待着你去发现💪",
        "宁静致远，愿你能在这份平静中找到前进的方向🧭",
        "平和的心态是心灵最好的庇护所🏠",
        "在喧嚣的世界里，保持内心的平静尤为重要🧘‍♀️"
      ],
      slightlyUnhappy: [
        "偶尔的情绪低落就像是小乌云☁️，很快就会散去。",
        "感觉到一丝丝的烦恼了吗？别担心，一切都会变好的🌈",
        "分享一下你的感受吧，哪怕只是简单的诉说💬",
        "一点点的忧郁，可能是心灵需要更多关怀的信号💔",
        "当心情有些沉重时，试着深呼吸，放松自己💨",
        "即便是小小的不满，也可以成为改变的契机🌱",
        "不如我们一起去吃个冰淇淋，让心情变得更好🍦",
        "每个人都会有情绪波动的时候，这是正常的起伏🌊",
        "不妨给自己一点时间，让自己慢慢调整过来⏰",
        "记得，即使是在黑暗中，也有一线光明在等着你🌟"
      ],
      unhappy: [
        "不开心的时候，找个人聊聊吧，说出来会好很多🗣️",
        "每个人都会有不开心的时候，这很正常，一起度过难关🤝",
        "感到难过时，请记住这只是暂时的，明天会更好🌞",
        "把心中的苦闷写出来，会让你感觉轻松许多📝",
        "遇到困难时，别忘了寻找支持的力量💪",
        "当你觉得孤单无助时，记得还有人在关心你🤗",
        "每一次的挫折，都是成长的机会🌱",
        "允许自己有不开心的时候，也是爱自己的表现💖",
        "面对不如意，我们可以一起寻找解决的办法🛠️",
        "相信自己有足够的力量度过这段艰难时期🔥"
      ],
      veryUnhappy: [
        "感到非常难过是吗？让我们一起面对这个时刻，你不是一个人💪",
        "再难过的心情也会过去，现在记录下来吧📝",
        "在这个艰难的时刻，请允许自己哭泣，释放压力💦",
        "无论多么黑暗的夜晚，总会迎来黎明曙光🌅",
        "你不是一个人在战斗，我在这里陪着你🤝",
        "虽然现在的路很难走，但请坚持下去，胜利就在前方🏁",
        "痛苦的感觉终将淡去，留下的只有坚强💪",
        "面对极大的悲伤，勇敢地说出来是第一步💬",
        "即使是在最黑暗的时刻，也不要放弃希望🌟",
        "我们一起走过这段艰难的旅程，直到见到光明🌈"
      ]
    },
    entranceTexts: {
      record: [
        "记录下这一刻的心情吧",
        "写下此刻的感受，让未来的自己了解现在的你",
        "点点滴滴的记录，串起生命中的每个瞬间"
      ],
      statistics: [
        "回顾本周,一笑而过",
        "本周情绪，新的视角看自己",
        "情绪小助手,AI助力"
      ],
      tools: [
        "来做些让心情放松的事吧",
        "试试这些减压小工具",
        "让我们一起缓解压力"
      ],
      painting: [
        "画画可以帮助平静心绪",
        "用画笔表达此刻的感受",
        "涂鸦是放松心情的好方法"
      ],
      meditation: [
        "让我们做个正念练习",
        "通过冥想找回内心的平静",
        "正念帮你重获内心的安宁"
      ]
    },
    currentEmotionText: '',
    entrances: []
  },

  methods: {
    show() {
      this.setData({ show: true });
    },

    hide() {
      this.setData({ 
        show: false,
        selectedEmotion: null,
        currentEmotionText: '',
        entrances: []
      });
    },

    getRandomText(texts) {
      const index = Math.floor(Math.random() * texts.length);
      return texts[index];
    },

    onEmotionSelect(e) {
      const type = e.currentTarget.dataset.type;
      //如果type是home，直接hide
      if (type === 'home') {
        this.hide();
        return;
      }
      const emotionMap = {
        veryHappy: { name: '非常开心', value: 100 },
        happy: { name: '开心', value: 75 },
        slightlyHappy: { name: '有点开心', value: 65 },
        neutral: { name: '不悲不喜', value: 50 },
        slightlyUnhappy: { name: '有点不开心', value: 35 },
        unhappy: { name: '不开心', value: 25 },
        veryUnhappy: { name: '非常不开心', value: 0 }
      };

      const selectedEmotion = {
        type,
        icon: `/images/icons/${type}.png`,
        name: emotionMap[type].name,
        value: emotionMap[type].value
      };
      
      // 设置情绪文案
      const emotionText = this.getRandomText(this.data.emotionTexts[type]);
      
      // 设置入口
      const entrances = this.getEntrances(type);
      
      this.setData({
        selectedEmotion,
        currentEmotionText: emotionText,
        entrances
      });
    },

    getEntrances(emotionType) {
      const entrances = [];
      const emotionData = require('../../utils/emotion-data.js');
      
      // 记录入口 - 所有情绪都显示
      entrances.push({
        type: 'record',
        text: this.getRandomText(this.data.entranceTexts.record),
        path: '/index/pages/emotion-details/emotion-details'
      });

      // 统计分析入口 - 本周有情绪记录时显示
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
      
      let weekEmotions = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        const dayEmotions = emotionData.getTodayEmotions(date);
        weekEmotions = weekEmotions.concat(dayEmotions);
      }

      if (weekEmotions.length > 0) {
        entrances.push({
          type: 'statistics',
          text: this.getRandomText(this.data.entranceTexts.statistics),
          path: '/pages/statistics/statistics'
        });
      }

      // 解压工具入口 - slightlyUnhappy和unhappy时显示
      if (['slightlyUnhappy', 'unhappy'].includes(emotionType)) {
        entrances.push({
          type: 'tools',
          text: this.getRandomText(this.data.entranceTexts.tools),
          path: '/pages/tools/tools'
        });
      }

      // 涂鸦入口 - neutral时显示
      if (emotionType === 'neutral') {
        entrances.push({
          type: 'painting',
          text: this.getRandomText(this.data.entranceTexts.painting),
          path: '/tools/pages/tools-draw/tools-draw'
        });
      }

      // 正念入口 - veryUnhappy时显示
      if (emotionType === 'veryUnhappy') {
        entrances.push({
          type: 'meditation',
          text: this.getRandomText(this.data.entranceTexts.meditation),
          path: '/tools/pages/tools-meditation/tools-meditation'
        });
      }

      return entrances;
    },

    onEntranceClick(e) {
      const { type, path } = e.currentTarget.dataset;
      
      if (type === 'record') {
        const app = getApp();
        app.globalData.recordType = 'current';
        app.globalData.selectedEmotion = this.data.selectedEmotion;
      }
      //如果path是 page开头
      if (path.startsWith('/pages')) {
        wx.switchTab({
          url: path,
          success: () => {
            this.hide();
          },
          fail: (err) => {
            console.error('Switch tab failed:', err);
          }
        });
      }else{
        wx.navigateTo({
          url: path,
          success: () => {
            this.hide();
          }
        });
      }
    },
  }
});
