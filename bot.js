if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

var Botkit = require('botkit');

var controller = Botkit.slackbot({
  debug: false
});

var bot = controller.spawn({
  token: process.env.token,
  retry: true
}).startRTM(function(error){
  if(error){
    throw new Error(error);
  }
});

let canPinRemoved = false;

controller.hears('�s���͂������Ă�[', ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
  canPinRemoved = true;
  bot.reply(message, '30�b�����҂�����');
  setTimeout((bot, message) => {
    canPinRemoved = false;
    bot.reply(message, '�ق����Ԃ���[');
  }, 10000, bot, message);
});

controller.on('pin_removed', function(bot, message) {

  if(canPinRemoved) return;

  bot.api.users.info({
    user: message.user
  }, function(error, result){
    if(error) console.log(error);

    let userName = result.user.name;

    bot.api.pins.add({
      channel: message.channel_id,
      timestamp: message.item.message.ts
    });

    bot.say({
      text: `������� @${userName} �͂�B ����Ƀs���͂�����Ƃ��Ă�[�B\n���Ⴀ�Ȃ�������������s�����Ƃ����Ł[`,
      link_names: true,
      channel: message.channel_id
    });
  });


});