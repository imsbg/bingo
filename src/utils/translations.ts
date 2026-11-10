/**
 * Multilingual Translation Dictionaries (Odia Default & English)
 * Game Name: ବିଙ୍ଗୋ | Bingo (1-25 Multiplayer & Solo)
 * Author: Sandeep Biswal G
 */

export type Language = 'en' | 'or';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  heroBadge: string;
  p2pRoomSubtitle: string;
  roomCode: string;
  createRoom: string;
  createRoomDesc: string;
  joinRoom: string;
  joinRoomDesc: string;
  joinAsPlayer: string;
  joinAsSpectator: string;
  yourName: string;
  namePlaceholder: string;
  player1Name: string;
  player2Name: string;
  player2Placeholder: string;
  startTwoPlayerGame: string;
  enterRoomCode: string;
  codePlaceholder: string;
  invalidCode: string;
  shareRoom: string;
  copyLink: string;
  copied: string;
  linkCopied: string;
  scanQr: string;
  scanWithCamera: string;
  shareViaMessaging: string;
  close: string;
  playerX: string;
  playerO: string;
  you: string;
  spectator: string;
  spectators: string;
  spectatorWatching: string;
  waitingForOpponent: string;
  waitingForReplay: string;
  shareLinkPrompt: string;
  yourTurn: string;
  opponentTurn: string;
  spectatorTurnNotice: string;
  wins: string;
  ties: string;
  drawsLabel: string;
  round: string;
  gameOverWin: string;
  gameOverDraw: string;
  youWonMessage: string;
  youLostMessage: string;
  playAgain: string;
  rematchRequested: string;
  acceptRematch: string;
  leaveRoom: string;
  settings: string;
  appearance: string;
  darkMode: string;
  lightMode: string;
  soundEffects: string;
  soundOn: string;
  soundOff: string;
  testSound: string;
  language: string;
  odia: string;
  english: string;
  promoTitle: string;
  promoBadge: string;
  downloadNow: string;
  webrtcStatus: string;
  connected: string;
  connecting: string;
  disconnected: string;
  peerRoleHost: string;
  peerRoleGuest: string;
  sendReaction: string;
  cheerOpponent: string;
  spectatorModeNotice: string;
  playSolo: string;
  passAndPlay: string;
  passAndPlayDesc: string;
  vsComputer: string;
  vsComputerDesc: string;
  multiplayer: string;
  computer: string;
  // Bingo 1-25 Specific Keys
  writeNumbers: string;
  setupSubtitle: string;
  tapToFillHint: string;
  randomize: string;
  clearBoard: string;
  doneSetup: string;
  waitingForOtherSetup: string;
  readyStatus: string;
  settingUpStatus: string;
  myBoard: string;
  opponentBoard: string;
  callNumber: string;
  callNumberHint: string;
  linesCompleted: string;
  numbersCalled: string;
  lastCalled: string;
  invalidGridAlert: string;
  howToPlayTitle: string;
  howToPlayStep1: string;
  howToPlayStep2: string;
  howToPlayStep3: string;
  madeByCredit: string;
  hiddenOpponentBoardNote: string;
  revealedOpponentBoardNote: string;
  passDeviceToPlayer2: string;
  // Timer & Game Data History
  totalPlayTime: string;
  roundTime: string;
  gameDataTitle: string;
  gameDataSubtitle: string;
  noRoundsYet: string;
  winnerLabel: string;
  timeTakenLabel: string;
  totalMovesLabel: string;
  finalMoveLabel: string;
  moveSequenceLabel: string;
  cellLabel: string;
  // Live Public Matches & Phone Cache
  makeRoomLiveLabel: string;
  makeRoomLiveDesc: string;
  liveMatchesTitle: string;
  liveMatchesSubtitle: string;
  noLiveMatches: string;
  openForPlayer: string;
  matchInProgress: string;
  phoneCacheBadge: string;
  // Room Creator Left & Refresh Prevention
  hostLeftNotice: string;
  hostLeftBannerTitle: string;
  hostLeftBannerDesc: string;
  refreshDisabledNotice: string;
  // Share with a Friend (Language Selector)
  shareWithFriend: string;
  shareLanguagePromptTitle: string;
  shareLanguagePromptSubtitle: string;
  shareViaWhatsApp: string;
  shareViaSystem: string;
  copyShareMessage: string;
  messageCopied: string;
  // Terms & Conditions / Privacy Page
  termsAndPrivacy: string;
  backToGame: string;
  termsPageTitle: string;
  termsPageSubtitle: string;
  termsNoDataTitle: string;
  termsNoDataDesc: string;
  termsWebrtcTitle: string;
  termsWebrtcDesc: string;
  termsLocalStorageTitle: string;
  termsLocalStorageDesc: string;
  termsFairPlayTitle: string;
  termsFairPlayDesc: string;
  moreAppsTitle: string;
  moreAppsDesc: string;
  downloadMoreAppsBtn: string;
  // Leave Room Confirmation & Mobile Menu
  leaveConfirmTitle: string;
  leaveConfirmDesc: string;
  leaveConfirmYes: string;
  leaveConfirmCancel: string;
  menuLabel: string;
  // Smart Play, Secret Mode, Spectator Warning & Tic Tac Toe Link
  smartPlayLabel: string;
  smartPlayDesc: string;
  smartPlayBadgeOn: string;
  smartPlayBadgeOff: string;
  secretOpponentNote: string;
  spectatorAntiCheatWarning: string;
  playTicTacToeLabel: string;
  playTicTacToeUrl: string;
  calledByP1: string;
  calledByP2: string;
  // Detailed Game Info & Smart Play Guide
  gameGuideTitle: string;
  gameGuideSubtitle: string;
  guideHowItWorksTitle: string;
  guideHowItWorksDesc: string;
  guideSmartPlayTitle: string;
  guideSmartPlayOnTitle: string;
  guideSmartPlayOnDesc: string;
  guideSmartPlayOffTitle: string;
  guideSmartPlayOffDesc: string;
  guideColorsTitle: string;
  guideColorsDesc: string;
  guideSpectatorTitle: string;
  guideSpectatorDesc: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'Bingo 1–25',
    appSubtitle: 'Play the classic 1–25 Bingo game online with SBXXXX rooms, live spectators, or solo!',
    heroBadge: 'ବିଙ୍ଗୋ • 1–25 Online Multiplayer & Solo Bingo',
    p2pRoomSubtitle: 'Online Multiplayer Bingo',
    roomCode: 'Room Code',
    createRoom: 'Create Room',
    createRoomDesc: 'Host a room with code SBXXXX',
    joinRoom: 'Join Room',
    joinRoomDesc: 'Join with SBXXXX or watch live',
    joinAsPlayer: 'Play as Player 2',
    joinAsSpectator: 'Watch as Spectator',
    yourName: 'Your Name',
    namePlaceholder: 'Enter your name...',
    player1Name: 'Player 1 Name',
    player2Name: 'Player 2 Name',
    player2Placeholder: 'Enter Player 2 name...',
    startTwoPlayerGame: 'Start 2-Player Bingo',
    enterRoomCode: 'Enter Room Code',
    codePlaceholder: 'e.g. SB7A9K',
    invalidCode: 'Please enter a valid SBXXXX room code (or 4-digit code)',
    shareRoom: 'Share Room',
    copyLink: 'Copy Link',
    copied: 'Copied!',
    linkCopied: 'Invite link copied to clipboard!',
    scanQr: 'QR Code',
    scanWithCamera: 'Scan with phone camera to join immediately',
    shareViaMessaging: 'Share via WhatsApp / Messaging',
    close: 'Close',
    playerX: 'Player 1',
    playerO: 'Player 2',
    you: 'You',
    spectator: 'Spectator',
    spectators: 'Spectators',
    spectatorWatching: 'watching live',
    waitingForOpponent: 'Waiting for opponent to join...',
    waitingForReplay: 'Waiting for players to play again...',
    shareLinkPrompt: 'Share this SB room code or invite link with your friend to start playing!',
    yourTurn: 'Your Turn — Call a Number!',
    opponentTurn: "'s Turn",
    spectatorTurnNotice: 'Current Turn:',
    wins: 'Wins',
    ties: 'Draws',
    drawsLabel: 'Draws',
    round: 'Round',
    gameOverWin: 'achieved B-I-N-G-O and won!',
    gameOverDraw: 'The round ended in a draw!',
    youWonMessage: 'You Won! B-I-N-G-O Complete!',
    youLostMessage: 'You Lost. {winnerName} Won!',
    playAgain: 'Play Again',
    rematchRequested: 'Rematch request sent...',
    acceptRematch: 'Opponent wants a rematch! Accept?',
    leaveRoom: 'Leave Room',
    settings: 'Settings',
    appearance: 'Appearance',
    darkMode: 'Dark Theme',
    lightMode: 'Light Theme',
    soundEffects: 'Sound Effects',
    soundOn: 'Audio Enabled',
    soundOff: 'Audio Muted',
    testSound: 'Test Sound',
    language: 'Language',
    odia: 'ଓଡ଼ିଆ',
    english: 'English',
    promoTitle: 'Featured App',
    promoBadge: 'Sponsored',
    downloadNow: 'Download Now',
    webrtcStatus: 'Connection Status',
    connected: 'Live Connected',
    connecting: 'Connecting...',
    disconnected: 'Offline / Waiting',
    peerRoleHost: 'Host (Player 1)',
    peerRoleGuest: 'Guest (Player 2)',
    sendReaction: 'Send Reaction',
    cheerOpponent: 'Cheer & React',
    spectatorModeNotice: 'You are watching this Bingo match live as a spectator.',
    playSolo: 'Play Solo vs Computer',
    passAndPlay: 'Pass & Play (2 Players)',
    passAndPlayDesc: '2 players on 1 phone or screen',
    vsComputer: 'Play vs Computer',
    vsComputerDesc: 'Challenge the smart AI Bingo opponent',
    multiplayer: 'Online Multiplayer',
    computer: 'Computer AI',
    // Bingo 1-25 Specific
    writeNumbers: 'Arrange Numbers from 1 to 25',
    setupSubtitle: 'Tap boxes in order to place 1–25, type custom numbers, or click Randomize!',
    tapToFillHint: 'Next number to place:',
    randomize: 'Randomize',
    clearBoard: 'Clear Grid',
    doneSetup: 'Done & Ready',
    waitingForOtherSetup: 'Waiting for other player to finish board setup...',
    readyStatus: 'Board Ready',
    settingUpStatus: 'Arranging Board...',
    myBoard: 'My Board',
    opponentBoard: "Opponent's Board",
    callNumber: 'Call a Number (1–25)',
    callNumberHint: 'Tap any uncalled number on your board or the caller pad below',
    linesCompleted: 'Lines',
    numbersCalled: 'Called',
    lastCalled: 'Last Called',
    invalidGridAlert: 'Please fill all 25 boxes with unique numbers between 1 and 25.',
    howToPlayTitle: 'How to Play Bingo (1–25)',
    howToPlayStep1: '1. Create or join an SBXXXX room, or choose Play vs Computer.',
    howToPlayStep2: '2. Fill your 5×5 board with unique numbers from 1 to 25 (or click Randomize) and click Done & Ready.',
    howToPlayStep3: '3. Take turns calling numbers (spoken aloud in English). Complete any 5 lines (rows, columns, or diagonals) first to spell B-I-N-G-O and win!',
    madeByCredit: 'Bingo 1–25 Online',
    hiddenOpponentBoardNote: 'Smart Play ON • Mini-map shows green & red boxes without numbers',
    revealedOpponentBoardNote: 'Match finished • Both players boards revealed',
    passDeviceToPlayer2: 'Pass device to set up board for',
    // Timer & Game Data History
    totalPlayTime: 'Total Playing Time',
    roundTime: 'Time Taken',
    gameDataTitle: 'Bingo Data & Round History',
    gameDataSubtitle: 'Round winners, time taken, called number sequence & winning number',
    noRoundsYet: 'Complete a Bingo round to see full round-by-round history and called number sequences.',
    winnerLabel: 'Winner',
    timeTakenLabel: 'Time Taken',
    totalMovesLabel: 'Numbers Called',
    finalMoveLabel: 'Winning Call',
    moveSequenceLabel: 'Called Numbers Order',
    cellLabel: 'Number',
    // Live Public Matches
    makeRoomLiveLabel: 'Make Room Public (Show in See Live Matches)',
    makeRoomLiveDesc: 'Anyone on the home screen can watch your Bingo match live as a spectator',
    liveMatchesTitle: 'See Live Matches',
    liveMatchesSubtitle: 'Watch public Bingo matches happening live right now as a spectator',
    noLiveMatches: 'No public live matches right now. Enable "Make Room Public" and create a room!',
    openForPlayer: 'Waiting for Player 2',
    matchInProgress: 'Live Match',
    phoneCacheBadge: 'Live Matches',
    // Room Creator Left & Refresh Prevention
    hostLeftNotice: 'The room creator has left the room. Match ended.',
    hostLeftBannerTitle: 'Room Creator Left the Room',
    hostLeftBannerDesc: 'The host has closed or left this room, so the live connection has ended.',
    refreshDisabledNotice: 'Page refresh is disabled during an active match to protect your game!',
    // Share with a Friend
    shareWithFriend: 'Share with a Friend',
    shareLanguagePromptTitle: 'In which language do you want to send the invite?',
    shareLanguagePromptSubtitle: 'Choose your preferred language for the invitation message and link:',
    shareViaWhatsApp: 'Send on WhatsApp',
    shareViaSystem: 'Share via Apps',
    copyShareMessage: 'Copy Message',
    messageCopied: 'Invitation message copied!',
    // Terms & Conditions
    termsAndPrivacy: 'Terms & Conditions',
    backToGame: 'Back to Game',
    termsPageTitle: 'Terms & Conditions and Privacy Policy',
    termsPageSubtitle: 'Zero data collection • Direct Peer-to-Peer gameplay',
    termsNoDataTitle: '1. Zero Data Collection & Complete Privacy',
    termsNoDataDesc: 'Odia Bingo does not collect, store, track, or sell any personal data, user accounts, IP addresses, or analytics on any external database or server. You can play freely without registration or login.',
    termsWebrtcTitle: '2. How Online Multiplayer Works',
    termsWebrtcDesc: 'Online rooms (SBXXXX) and live spectator streams operate directly between players browsers using peer-to-peer data channels. Boards, called numbers, scores, and emoji reactions are transmitted directly between connected devices in real time.',
    termsLocalStorageTitle: '3. Local Device Preferences Only',
    termsLocalStorageDesc: 'Your chosen display name, theme preference (dark or light), language selection, and sound settings are saved strictly inside your own browser local storage on your device.',
    termsFairPlayTitle: '4. Free Access & Fair Play',
    termsFairPlayDesc: 'This game is completely free for everyone to play solo or with friends. Inactive public rooms with no number call or reaction for 2 minutes are automatically removed from the live match list.',
    moreAppsTitle: 'Explore & Download More Apps',
    moreAppsDesc: 'Check out more useful Odia and utility applications on Google Play Store.',
    downloadMoreAppsBtn: 'Download More Apps on Google Play',
    // Leave Room Confirmation & Mobile Menu
    leaveConfirmTitle: 'Leave Match?',
    leaveConfirmDesc: 'Are you sure you want to leave this Bingo match and return to the home screen?',
    leaveConfirmYes: 'Yes, Leave',
    leaveConfirmCancel: 'Stay in Match',
    menuLabel: 'Menu',
    // Smart Play, Secret Mode, Spectator Warning & Tic Tac Toe Link
    smartPlayLabel: 'Smart Play (Live B-I-N-G-O & Mini-Map)',
    smartPlayDesc: 'Shows opponent mini-map without numbers, live B-I-N-G-O progress, and 2-color player numbers',
    smartPlayBadgeOn: 'Smart Play ON',
    smartPlayBadgeOff: 'Secret Mode (Smart Play OFF)',
    secretOpponentNote: 'Secret Mode: Opponent board data & B-I-N-G-O progress are hidden until someone wins!',
    spectatorAntiCheatWarning: 'Fair Play Warning: Do not support cheating! Do not share board numbers or positions with "{p1}" and "{p2}".',
    playTicTacToeLabel: 'Play Tic Tac Toe',
    playTicTacToeUrl: 'https://chhakisuna.netlify.app/en',
    calledByP1: 'P1 Number',
    calledByP2: 'P2 Number',
    // Detailed Game Info & Smart Play Guide
    gameGuideTitle: 'About Bingo 1–25 & How It Works',
    gameGuideSubtitle: 'Complete guide to rules, Smart Play vs Secret Mode, 2-color numbers, and Spectator view',
    guideHowItWorksTitle: '1. 5×5 Board Setup & Calling Numbers',
    guideHowItWorksDesc: 'Each player arranges numbers 1 to 25 on their 5×5 grid (tap in order, type custom numbers, or click Randomize). Players take turns calling any uncalled number. Every called number is announced aloud in English and crossed out on both boards simultaneously. The first player to complete 5 full lines (horizontal, vertical, or diagonal) spells B-I-N-G-O and wins!',
    guideSmartPlayTitle: '2. What is Smart Play vs Secret Mode?',
    guideSmartPlayOnTitle: 'Smart Play ON (Tactical Mode)',
    guideSmartPlayOnDesc: 'When Smart Play is checked when creating a room, both players see a live 5×5 Mini-Map of their opponent’s board without numbers (showing only red called boxes and green completed-line boxes) along with live opponent B-I-N-G-O letter progress.',
    guideSmartPlayOffTitle: 'Smart Play OFF (Default Secret Mode)',
    guideSmartPlayOffDesc: 'By default, Smart Play is OFF. Your opponent’s board and B-I-N-G-O progress remain completely secret (? ? ? ? ?) during the match. As soon as someone wins, both players’ full 5×5 boards are revealed side-by-side!',
    guideColorsTitle: '3. Red & Green Boxes + 2-Color Player Numbers',
    guideColorsDesc: 'Called boxes turn Red, and boxes that complete a 5-cell line turn Green. Inside those boxes, numbers called by Player 1 are colored Blue and numbers called by Player 2 are colored Orange/Amber, while the Last Called number glows with a golden ring.',
    guideSpectatorTitle: '4. Live Spectator Mode & Emoji Reactions',
    guideSpectatorDesc: 'Spectators can join any room code (SBXXXX) or Live Match to watch Player 1 (left) and Player 2 (right) boards side-by-side in real time and send cheering reactions from the right-side vertical panel.',
  },
  or: {
    appTitle: 'ବିଙ୍ଗୋ',
    appSubtitle: 'SBXXXX କୋଡ୍ ସହିତ ସାଙ୍ଗମାନଙ୍କ ସହ ଅନଲାଇନ୍ କିମ୍ବା କମ୍ପ୍ୟୁଟର ସହ ୧–୨୫ ବିଙ୍ଗୋ ଖେଳନ୍ତୁ',
    heroBadge: 'ବିଙ୍ଗୋ • ଅନଲାଇନ୍ ଏବଂ କମ୍ପ୍ୟୁଟର ଖେଳ',
    p2pRoomSubtitle: 'ଅନଲାଇନ୍ ମଲ୍ଟିପ୍ଲେୟାର୍ ବିଙ୍ଗୋ କୋଠରି',
    roomCode: 'ରୁମ୍ କୋଡ୍',
    createRoom: 'ରୁମ୍ ବନାନ୍ତୁ',
    createRoomDesc: 'SBXXXX କୋଡ୍ ସହିତ ନୂଆ ରୁମ୍ ଖୋଲନ୍ତୁ',
    joinRoom: 'ରୁମ୍ ଯୋଗ ଦିଅନ୍ତୁ',
    joinRoomDesc: 'SBXXXX କୋଡ୍ ଦେଇ ଖେଳନ୍ତୁ କିମ୍ବା ଲାଇଭ୍ ଦେଖନ୍ତୁ',
    joinAsPlayer: 'ଖେଳାଳି ଭାବେ ଯୋଗ ଦିଅନ୍ତୁ',
    joinAsSpectator: 'ଦର୍ଶକ ଭାବେ ଦେଖନ୍ତୁ',
    yourName: 'ତୁମର ନାମ',
    namePlaceholder: 'ତୁମର ନାମ ଲେଖନ୍ତୁ...',
    player1Name: 'ଖେଳାଳି ୧ ଙ୍କ ନାମ',
    player2Name: 'ଖେଳାଳି ୨ ଙ୍କ ନାମ',
    player2Placeholder: 'ଖେଳାଳି ୨ ଙ୍କ ନାମ ଲେଖନ୍ତୁ...',
    startTwoPlayerGame: '୨-ଖେଳାଳି ବିଙ୍ଗୋ ଆରମ୍ଭ କରନ୍ତୁ',
    enterRoomCode: 'ରୁମ୍ କୋଡ୍ ପ୍ରବେଶ କରନ୍ତୁ',
    codePlaceholder: 'ଯଥା: SB7A9K',
    invalidCode: 'ଦୟାକରି ବୈଧ SBXXXX ରୁମ୍ କୋଡ୍ ଦିଅନ୍ତୁ',
    shareRoom: 'ରୁମ୍ ସେୟାର୍ କରନ୍ତୁ',
    copyLink: 'ଲିଙ୍କ୍ କପି କରନ୍ତୁ',
    copied: 'କପି ହୋଇଗଲା!',
    linkCopied: 'ନିମନ୍ତ୍ରଣ ଲିଙ୍କ୍ କପି ହୋଇଗଲା!',
    scanQr: 'କ୍ୟୁଆର୍ କୋଡ୍',
    scanWithCamera: 'ତୁରନ୍ତ ଯୋଗ ଦେବା ପାଇଁ କ୍ୟାମେରାରେ ସ୍କାନ୍ କରନ୍ତୁ',
    shareViaMessaging: 'ହ୍ୱାଟ୍ସଆପ୍ କିମ୍ବା ମେସେଜ୍ ଦ୍ୱାରା ପଠାନ୍ତୁ',
    close: 'ବନ୍ଦ କରନ୍ତୁ',
    playerX: 'ଖେଳାଳି ୧',
    playerO: 'ଖେଳାଳି ୨',
    you: 'ଆପଣ',
    spectator: 'ଦର୍ଶକ',
    spectators: 'ଦର୍ଶକମାନେ',
    spectatorWatching: 'ଜଣ ଲାଇଭ୍ ଦେଖୁଛନ୍ତି',
    waitingForOpponent: 'ଅନ୍ୟ ଖେଳାଳିଙ୍କ ପାଇଁ ଅପେକ୍ଷା...',
    waitingForReplay: 'ଖେଳାଳିମାନେ ପୁଣି ଖେଳ ଆରମ୍ଭ କରିବାକୁ ଅପେକ୍ଷା କରାଯାଉଛି...',
    shareLinkPrompt: 'ଖେଳିବା ପାଇଁ ଏହି SB କୋଡ୍ କିମ୍ବା ଲିଙ୍କ୍ ଆପଣଙ୍କ ସାଙ୍ଗଙ୍କୁ ପଠାନ୍ତୁ!',
    yourTurn: 'ତୁମର ପାଳି — ନମ୍ବର ବାଛନ୍ତୁ!',
    opponentTurn: "'ଙ୍କ ପାଳି",
    spectatorTurnNotice: 'ବର୍ତ୍ତମାନ ପାଳି:',
    wins: 'ବିଜୟ',
    ties: 'ସମାନ',
    drawsLabel: 'ସମାନ',
    round: 'ରାଉଣ୍ଡ',
    gameOverWin: 'B-I-N-G-O ସମ୍ପୂର୍ଣ୍ଣ କରି ଜିତିଲେ!',
    gameOverDraw: 'ଖେଳଟି ସମାନ ରହିଲା!',
    youWonMessage: 'ତୁମେ ଜିତିଲ!',
    youLostMessage: 'ତୁମେ ହାରିଲ । {winnerName} ଜିତିଲେ!',
    playAgain: 'ପୁଣି ଖେଳନ୍ତୁ',
    rematchRequested: 'ପୁନଃ ଖେଳ ପାଇଁ ଅନୁରୋଧ ପଠାଗଲା...',
    acceptRematch: 'ପ୍ରତିପକ୍ଷ ପୁଣି ଖେଳିବାକୁ ଚାହାଁନ୍ତି! ରାଜି କି?',
    leaveRoom: 'ରୁମ୍ ଛାଡନ୍ତୁ',
    settings: 'ସେଟିଙ୍ଗସ୍',
    appearance: 'ଦୃଶ୍ୟ',
    darkMode: 'ଡାର୍କ ମୋଡ୍',
    lightMode: 'ଲାଇଟ୍ ମୋଡ୍',
    soundEffects: 'ଧ୍ୱନି ପ୍ରଭାବ',
    soundOn: 'ଧ୍ୱନି ଚାଲୁ',
    soundOff: 'ଧ୍ୱନି ବନ୍ଦ',
    testSound: 'ଧ୍ୱନି ପରୀକ୍ଷା',
    language: 'ଭାଷା',
    odia: 'ଓଡ଼ିଆ',
    english: 'English',
    promoTitle: 'ବିଜ୍ଞାପିତ ଆପ୍',
    promoBadge: 'ସ୍ପନସର୍ଡ୍',
    downloadNow: 'ଡାଉନଲୋଡ୍ କରନ୍ତୁ',
    webrtcStatus: 'ସଂଯୋଗ ସ୍ଥିତି',
    connected: 'ଲାଇଭ୍ ସଂଯୁକ୍ତ',
    connecting: 'ସଂଯୋଗ ହେଉଛି...',
    disconnected: 'ଅସଂଯୁକ୍ତ / ଅପେକ୍ଷାରେ',
    peerRoleHost: 'ହୋଷ୍ଟ (ଖେଳାଳି ୧)',
    peerRoleGuest: 'ଅତିଥି (ଖେଳାଳି ୨)',
    sendReaction: 'ପ୍ରତିକ୍ରିୟା ପଠାନ୍ତୁ',
    cheerOpponent: 'ଉତ୍ସାହିତ କରନ୍ତୁ',
    spectatorModeNotice: 'ଆପଣ ଏହି ବିଙ୍ଗୋ ଖେଳକୁ ସିଧାସଳଖ ଲାଇଭ୍ ଦେଖୁଛନ୍ତି ।',
    playSolo: 'ଏକାକୀ ଖେଳନ୍ତୁ (କମ୍ପ୍ୟୁଟର ସହିତ)',
    passAndPlay: 'ଏବେ ଖେଳନ୍ତୁ (୨ ଖେଳାଳି)',
    passAndPlayDesc: 'ଗୋଟିଏ ଫୋନ୍ ରେ ୨ ଜଣ ଖେଳନ୍ତୁ',
    vsComputer: 'କମ୍ପ୍ୟୁଟର ବିପକ୍ଷରେ ଖେଳନ୍ତୁ',
    vsComputerDesc: 'ଚତୁର କମ୍ପ୍ୟୁଟର ସହିତ ବିଙ୍ଗୋ ଖେଳନ୍ତୁ',
    multiplayer: 'ଅନଲାଇନ୍ ମଲ୍ଟିପ୍ଲେୟାର୍',
    computer: 'କମ୍ପ୍ୟୁଟର',
    // Bingo 1-25 Specific
    writeNumbers: '୧ ରୁ ୨୫ ମଧ୍ୟରେ ସଂଖ୍ୟା ଲେଖନ୍ତୁ',
    setupSubtitle: '୧ ରୁ ୨୫ ପର୍ଯ୍ୟନ୍ତ କ୍ରମରେ ବକ୍ସ ଉପରେ ଟାପ୍ କରନ୍ତୁ କିମ୍ବା ଓଲଟପାଲଟ କରନ୍ତୁ!',
    tapToFillHint: 'ପରବର୍ତ୍ତୀ ସଂଖ୍ୟା:',
    randomize: 'ଓଲଟପାଲଟ କରନ୍ତୁ',
    clearBoard: 'ସଫା କରନ୍ତୁ',
    doneSetup: 'ହୋଇଗଲା',
    waitingForOtherSetup: 'ଅନ୍ୟ ଖେଳାଳିଙ୍କ ପାଇଁ ଅପେକ୍ଷା...',
    readyStatus: 'ପ୍ରସ୍ତୁତ',
    settingUpStatus: 'ବୋର୍ଡ ସଜାଉଛନ୍ତି...',
    myBoard: 'ମୋ ବୋର୍ଡ',
    opponentBoard: 'ପ୍ରତିପକ୍ଷଙ୍କ ବୋର୍ଡ',
    callNumber: 'ନମ୍ବର ବାଛନ୍ତୁ',
    callNumberHint: 'ଆପଣଙ୍କ ବୋର୍ଡ କିମ୍ବା ତଳେ ଥିବା ୧–୨୫ ବଟନ୍ ରୁ ଯେକୌଣସି ନମ୍ବର ବାଛନ୍ତୁ',
    linesCompleted: 'ଲାଇନ୍',
    numbersCalled: 'ଡକାଯାଇଥିବା ନମ୍ବର',
    lastCalled: 'ଶେଷ ନମ୍ବର',
    invalidGridAlert: 'ଦୟାକରି ସମସ୍ତ ୨୫ଟି ଘରେ ୧ ରୁ ୨୫ ମଧ୍ୟରେ ଭିନ୍ନ ଭିନ୍ନ ସଂଖ୍ୟା ଭରନ୍ତୁ ।',
    howToPlayTitle: 'କିପରି ଖେଳିବେ (ବିଙ୍ଗୋ ୧–୨୫)',
    howToPlayStep1: '୧. ରୁମ୍ ବନାନ୍ତୁ/ଯୋଗ ଦିଅନ୍ତୁ କିମ୍ବା କମ୍ପ୍ୟୁଟର ସହିତ ଖେଳନ୍ତୁ ।',
    howToPlayStep2: '୨. ୧-୨୫ ମଧ୍ୟରେ ୨୫ଟି ସଂଖ୍ୟା ବାଛନ୍ତୁ (କିମ୍ବା ଓଲଟପାଲଟ କରନ୍ତୁ) ଏବଂ "ହୋଇଗଲା" ଦବାନ୍ତୁ ।',
    howToPlayStep3: '୩. ପାଳି କରି ନମ୍ବର ଡାକନ୍ତୁ (ଇଂରାଜୀ ସ୍ୱରରେ ଶୁଣାଯିବ) । ପ୍ରଥମେ ୫ଟି ଲାଇନ୍ ସମ୍ପୂର୍ଣ୍ଣ କରି B-I-N-G-O ବନାନ୍ତୁ ଏବଂ ଜିତନ୍ତୁ!',
    madeByCredit: 'ବିଙ୍ଗୋ ୧–୨୫ ଅନଲାଇନ୍',
    hiddenOpponentBoardNote: 'ସ୍ମାର୍ଟ ପ୍ଲେ ଅନ୍ • ବିନା ନମ୍ବରରେ ସବୁଜ ଏବଂ ଲାଲ୍ ଘର ଦେଖାଯାଏ',
    revealedOpponentBoardNote: 'ଖେଳ ସମାପ୍ତ • ଉଭୟ ଖେଳାଳିଙ୍କ ବୋର୍ଡ ପ୍ରକାଶିତ',
    passDeviceToPlayer2: 'ବୋର୍ଡ ସଜାଇବା ପାଇଁ ଫୋନ୍ ଦିଅନ୍ତୁ:',
    // Timer & Game Data History
    totalPlayTime: 'ମୋଟ ଖେଳ ସମୟ',
    roundTime: 'ସମୟ ନେଇଛନ୍ତି',
    gameDataTitle: 'ଖେଳ ତଥ୍ୟ ଏବଂ ରାଉଣ୍ଡ ଇତିହାସ',
    gameDataSubtitle: 'କେଉଁ ରାଉଣ୍ଡରେ କିଏ ଜିତିଲେ, ସମୟ ଏବଂ ଡକାଯାଇଥିବା ସମସ୍ତ ନମ୍ବରର ବିବରଣୀ',
    noRoundsYet: 'ଖେଳ ତଥ୍ୟ, ସମୟ ଏବଂ ଶେଷ ନମ୍ବର ଦେଖିବା ପାଇଁ ଗୋଟିଏ ରାଉଣ୍ଡ ଶେଷ କରନ୍ତୁ ।',
    winnerLabel: 'ଫଳାଫଳ',
    timeTakenLabel: 'ସମୟ ନେଇଛନ୍ତି:',
    totalMovesLabel: 'ମୋଟ ନମ୍ବର',
    finalMoveLabel: 'ବିଜୟୀ ନମ୍ବର',
    moveSequenceLabel: 'ଡକାଯାଇଥିବା ନମ୍ବର କ୍ରମ',
    cellLabel: 'ନମ୍ବର',
    // Live Public Matches
    makeRoomLiveLabel: 'ରୁମ୍ କୁ ଲାଇଭ୍ କରନ୍ତୁ (ସମସ୍ତେ ଦେଖିପାରିବେ)',
    makeRoomLiveDesc: 'ଅନ୍ୟମାନେ ହୋମ୍ ସ୍କ୍ରିନରୁ ଦର୍ଶକ ଭାବେ ଏହି ବିଙ୍ଗୋ ଖେଳକୁ ସିଧାସଳଖ ଲାଇଭ୍ ଦେଖିପାରିବେ',
    liveMatchesTitle: 'ଚାଲୁଥିବା ଲାଇଭ୍ ଖେଳ ଦେଖନ୍ତୁ',
    liveMatchesSubtitle: 'ବର୍ତ୍ତମାନ ଚାଲୁଥିବା ବିଙ୍ଗୋ ଖେଳଗୁଡ଼ିକୁ ଦର୍ଶକ ଭାବେ ଲାଇଭ୍ ଦେଖନ୍ତୁ',
    noLiveMatches: 'ବର୍ତ୍ତମାନ କୌଣସି ଲାଇଭ୍ ଖେଳ ନାହିଁ । "ରୁମ୍ କୁ ଲାଇଭ୍ କରନ୍ତୁ" ଅନ୍ କରି ନୂଆ ରୁମ୍ ବନାନ୍ତୁ!',
    openForPlayer: 'ପ୍ରତିପକ୍ଷଙ୍କୁ ଅପେକ୍ଷା',
    matchInProgress: 'ଲାଇଭ୍ ଖେଳ ଚାଲିଛି',
    phoneCacheBadge: 'ଲାଇଭ୍ ଖେଳ',
    // Room Creator Left & Refresh Prevention
    hostLeftNotice: 'ରୁମ୍ ନିର୍ମାତା ରୁମ୍ ଛାଡ଼ି ଚାଲିଯାଇଛନ୍ତି । ଖେଳ ସମାପ୍ତ ହୋଇଛି ।',
    hostLeftBannerTitle: 'ରୁମ୍ ନିର୍ମାତା ରୁମ୍ ଛାଡ଼ି ଚାଲିଯାଇଛନ୍ତି',
    hostLeftBannerDesc: 'ଏହି ରୁମ୍ ର ନିର୍ମାତା ରୁମ୍ ବନ୍ଦ କରିଦେଇଛନ୍ତି କିମ୍ବା ବାହାରି ଯାଇଛନ୍ତି, ତେଣୁ ଲାଇଭ୍ ସଂଯୋଗ ସମାପ୍ତ ହୋଇଛି ।',
    refreshDisabledNotice: 'ଖେଳ ଚାଲିଥିବା ସମୟରେ ପୃଷ୍ଠା ରିଫ୍ରେସ୍ କରିବା ବନ୍ଦ କରାଯାଇଛି!',
    // Share with a Friend
    shareWithFriend: 'ସାଙ୍ଗମାନଙ୍କୁ ଆମନ୍ତ୍ରଣ',
    shareLanguagePromptTitle: 'ଆପଣ କେଉଁ ଭାଷାରେ ବାର୍ତ୍ତା ପଠାଇବାକୁ ଚାହୁଁଛନ୍ତି?',
    shareLanguagePromptSubtitle: 'ଆପଣଙ୍କ ସାଙ୍ଗଙ୍କୁ ନିମନ୍ତ୍ରଣ ବାର୍ତ୍ତା ପଠାଇବା ପାଇଁ ଭାଷା ବାଛନ୍ତୁ:',
    shareViaWhatsApp: 'ହ୍ୱାଟ୍ସଆପ୍ ରେ ପଠାନ୍ତୁ',
    shareViaSystem: 'ଅନ୍ୟ ଆପ୍ ମାଧ୍ୟମରେ ପଠାନ୍ତୁ',
    copyShareMessage: 'ବାର୍ତ୍ତା କପି କରନ୍ତୁ',
    messageCopied: 'ନିମନ୍ତ୍ରଣ ବାର୍ତ୍ତା କପି ହୋଇଗଲା!',
    // Terms & Conditions
    termsAndPrivacy: 'ନିୟମ ଓ ସର୍ତ୍ତାବଳୀ',
    backToGame: 'ଖେଳକୁ ଫେରନ୍ତୁ',
    termsPageTitle: 'ନିୟମ, ସର୍ତ୍ତାବଳୀ ଏବଂ ଗୋପନୀୟତା ନୀତି',
    termsPageSubtitle: 'କୌଣସି ତଥ୍ୟ ସଂଗ୍ରହ ନାହିଁ • ସିଧାସଳଖ ଅନଲାଇନ୍ ସଂଯୋଗ ଦ୍ୱାରା ଖେଳ',
    termsNoDataTitle: '୧. କୌଣସି ବ୍ୟକ୍ତିଗତ ତଥ୍ୟ ସଂଗ୍ରହ କରାଯାଏ ନାହିଁ',
    termsNoDataDesc: 'ବିଙ୍ଗୋ ୱେବସାଇଟ୍ ଆପଣଙ୍କର କୌଣସି ବ୍ୟକ୍ତିଗତ ତଥ୍ୟ, ଫୋନ୍ ନମ୍ବର, ଇମେଲ୍ କିମ୍ବା ଅନ୍ୟ କୌଣସି ସୂଚନା କୌଣସି ସର୍ଭରରେ ସଂଗ୍ରହ କିମ୍ବା ସଂରକ୍ଷଣ କରେ ନାହିଁ । ଆପଣ ବିନା କୌଣସି ପଞ୍ଜୀକରଣ କିମ୍ବା ଲଗଇନ୍ ରେ ସମ୍ପୂର୍ଣ୍ଣ ସୁରକ୍ଷିତ ଭାବେ ଏହି ଖେଳ ଖେଳିପାରିବେ ।',
    termsWebrtcTitle: '୨. ଅନଲାଇନ୍ ଖେଳ କିପରି କାର୍ଯ୍ୟ କରେ',
    termsWebrtcDesc: 'ଏହି ୱେବସାଇଟ୍ ସିଧାସଳଖ ଅନଲାଇନ୍ ସଂଯୋଗ ଦ୍ୱାରା କାର୍ଯ୍ୟ କରେ । ଅନଲାଇନ୍ ରୁମ୍ ଏବଂ ଲାଇଭ୍ ଦର୍ଶକ ସଂଯୋଗ ସିଧାସଳଖ ଗୋଟିଏ ଫୋନ୍ କିମ୍ବା କମ୍ପ୍ୟୁଟରରୁ ଅନ୍ୟ ଫୋନ୍ ସହିତ ଯୋଡ଼ି ହୁଏ ।',
    termsLocalStorageTitle: '୩. କେବଳ ଆପଣଙ୍କ ଫୋନ୍ ରେ ସୁରକ୍ଷିତ ପସନ୍ଦ',
    termsLocalStorageDesc: 'ଆପଣଙ୍କର ନାମ, ଭାଷା ପସନ୍ଦ, ଡାର୍କ କିମ୍ବା ଲାଇଟ୍ ମୋଡ୍ ଏବଂ ଧ୍ୱନି ସେଟିଙ୍ଗସ୍ କେବଳ ଆପଣଙ୍କ ନିଜ ଫୋନ୍ କିମ୍ବା ବ୍ରାଉଜର୍ ଭିତରେ ସୁରକ୍ଷିତ ରହେ ।',
    termsFairPlayTitle: '୪. ମାଗଣା ଖେଳ ଏବଂ ଲାଇଭ୍ ରୁମ୍ ନିୟମ',
    termsFairPlayDesc: 'ଏହି ଖେଳ ସମସ୍ତଙ୍କ ପାଇଁ ସମ୍ପୂର୍ଣ୍ଣ ମାଗଣା ଅଟେ । ଯଦି କୌଣସି ଲାଇଭ୍ ରୁମ୍ ରେ ୨ ମିନିଟ୍ ପର୍ଯ୍ୟନ୍ତ କୌଣସି ଚାଲ କିମ୍ବା ପ୍ରତିକ୍ରିୟା ନ ହୁଏ, ତେବେ ସେହି ରୁମ୍ ଟି ଲାଇଭ୍ ତାଲିକାରୁ ଆପଣାଛାଏଁ ହଟିଯାଏ ।',
    moreAppsTitle: 'ଅଧିକ ଓଡ଼ିଆ ଆପ୍ ଡାଉନଲୋଡ୍ କରନ୍ତୁ',
    moreAppsDesc: 'ଅନ୍ୟାନ୍ୟ ଉପଯୋଗୀ ଓଡ଼ିଆ ଆପ୍ ଗୁଡ଼ିକ ଗୁଗଲ୍ ପ୍ଲେ ଷ୍ଟୋରରୁ ଡାଉନଲୋଡ୍ କରନ୍ତୁ ।',
    downloadMoreAppsBtn: 'ଅଧିକ ଆପ୍ ଡାଉନଲୋଡ୍ କରନ୍ତୁ',
    // Leave Room Confirmation & Mobile Menu
    leaveConfirmTitle: 'ରୁମ୍ ଛାଡ଼ିବେ କି?',
    leaveConfirmDesc: 'ଆପଣ ନିଶ୍ଚିତ କି ଆପଣ ଏହି ବିଙ୍ଗୋ ଖେଳ ଛାଡ଼ି ହୋମ୍ ସ୍କ୍ରିନକୁ ଫେରିବାକୁ ଚାହୁଁଛନ୍ତି?',
    leaveConfirmYes: 'ହଁ, ରୁମ୍ ଛାଡନ୍ତୁ',
    leaveConfirmCancel: 'ନା, ଖେଳରେ ରୁହନ୍ତୁ',
    menuLabel: 'ମେନୁ',
    // Smart Play, Secret Mode, Spectator Warning & Tic Tac Toe Link
    smartPlayLabel: 'ସ୍ମାର୍ଟ ପ୍ଲେ (ଲାଇଭ୍ ମିନି-ମ୍ୟାପ୍)',
    smartPlayDesc: 'ପ୍ରତିପକ୍ଷଙ୍କ ମିନି-ମ୍ୟାପ୍ (ବିନା ନମ୍ବରରେ), ଲାଇନ୍ ପ୍ରଗତି ଏବଂ ୨-ରଙ୍ଗର ନମ୍ବର ଦେଖାଯିବ',
    smartPlayBadgeOn: 'ସ୍ମାର୍ଟ ପ୍ଲେ ଅନ୍',
    smartPlayBadgeOff: 'ଗୁପ୍ତ ମୋଡ୍ (ସ୍ମାର୍ଟ ପ୍ଲେ ଅଫ୍)',
    secretOpponentNote: 'ଗୁପ୍ତ ମୋଡ୍: ପ୍ରତିପକ୍ଷଙ୍କ ବୋର୍ଡ ଏବଂ ଲାଇନ୍ ପ୍ରଗତି ଲୁଚି ରହିଛି! ଖେଳ ଶେଷ ହେବା ପରେ ଉଭୟ ବୋର୍ଡ ଦେଖାଯିବ ।',
    spectatorAntiCheatWarning: 'ସତର୍କ ସୂଚନା: ଅସାଧୁ ଉପାୟକୁ ସମର୍ଥନ କରନ୍ତୁ ନାହିଁ! "{p1}" ଏବଂ "{p2}" ଙ୍କ ସହିତ ବୋର୍ଡ ସେୟାର କରନ୍ତୁ ନାହିଁ ।',
    playTicTacToeLabel: 'ଛକି ଶୂନ ଖେଳନ୍ତୁ',
    playTicTacToeUrl: 'https://chhakisuna.netlify.app/odia',
    calledByP1: 'ଖେଳାଳି ୧ ରଙ୍ଗ',
    calledByP2: 'ଖେଳାଳି ୨ ରଙ୍ଗ',
    // Detailed Game Info & Smart Play Guide
    gameGuideTitle: 'ବିଙ୍ଗୋ ୧–୨୫ ଖେଳ ବିଷୟରେ ସମ୍ପୂର୍ଣ୍ଣ ସୂଚନା',
    gameGuideSubtitle: 'ଖେଳର ନିୟମ, ସ୍ମାର୍ଟ ପ୍ଲେ ବନାମ ଗୁପ୍ତ ମୋଡ୍, ୨-ରଙ୍ଗର ନମ୍ବର ଏବଂ ଦର୍ଶକ ମୋଡ୍',
    guideHowItWorksTitle: '୧. ୫×୫ ବୋର୍ଡ ସଜାଇବା ଏବଂ ନମ୍ବର ଡାକିବା',
    guideHowItWorksDesc: 'ପ୍ରତ୍ୟେକ ଖେଳାଳି ନିଜର ୫×୫ ବୋର୍ଡରେ ୧ ରୁ ୨୫ ପର୍ଯ୍ୟନ୍ତ ସଂଖ୍ୟା ସଜାନ୍ତି (କ୍ରମରେ ଟାପ୍ କରି କିମ୍ବା ଓଲଟପାଲଟ ବଟନ୍ ଦ୍ୱାରା) । ଖେଳାଳିମାନେ ପାଳି କରି ଗୋଟିଏ ଲେଖାଏଁ ନମ୍ବର ବାଛନ୍ତି । ବଛାଯାଇଥିବା ନମ୍ବର ଇଂରାଜୀ ସ୍ୱରରେ ଶୁଣାଯାଏ ଏବଂ ଉଭୟ ଖେଳାଳିଙ୍କ ବୋର୍ଡରେ କଟିଯାଏ । ଯିଏ ପ୍ରଥମେ ୫ଟି ଲାଇନ୍ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତି, ସିଏ ବିଜୟୀ ହୁଅନ୍ତି!',
    guideSmartPlayTitle: '୨. ସ୍ମାର୍ଟ ପ୍ଲେ କ’ଣ?',
    guideSmartPlayOnTitle: 'ସ୍ମାର୍ଟ ପ୍ଲେ ଅନ୍',
    guideSmartPlayOnDesc: 'ରୁମ୍ ବନାଇବା ସମୟରେ "ସ୍ମାର୍ଟ ପ୍ଲେ" ଚେକ୍-ବକ୍ସ ଅନ୍ କଲେ, ଖେଳ ଚାଲିଥିବା ସମୟରେ ପ୍ରତିପକ୍ଷଙ୍କ ୫×୫ ମିନି-ମ୍ୟାପ୍ (ବିନା ନମ୍ବରରେ କେବଳ ଲାଲ୍ ଓ ସବୁଜ ଘର) ଏବଂ ସେମାନଙ୍କର ଲାଇନ୍ ପ୍ରଗତି ଦେଖାଯାଏ ।',
    guideSmartPlayOffTitle: 'ସ୍ମାର୍ଟ ପ୍ଲେ ଅଫ୍ (ଡିଫଲ୍ଟ ଗୁପ୍ତ ମୋଡ୍)',
    guideSmartPlayOffDesc: 'ଡିଫଲ୍ଟ ଭାବେ ସ୍ମାର୍ଟ ପ୍ଲେ ବନ୍ଦ ଥାଏ । ଏଥିରେ ପ୍ରତିପକ୍ଷଙ୍କ ବୋର୍ଡ ଏବଂ ଲାଇନ୍ ପ୍ରଗତି ସମ୍ପୂର୍ଣ୍ଣ ଗୁପ୍ତ ରହେ । କେହି ଜଣେ ଖେଳ ଜିତିବା ପରେ ଉଭୟ ଖେଳାଳିଙ୍କ ସମ୍ପୂର୍ଣ୍ଣ ବୋର୍ଡ ପାଖାପାଖି ଦେଖାଯାଏ!',
    guideColorsTitle: '୩. ଲାଲ୍ ଓ ସବୁଜ ବକ୍ସ ଏବଂ ୨-ରଙ୍ଗର ନମ୍ବର',
    guideColorsDesc: 'ଡକାଯାଇଥିବା ନମ୍ବରର ଘର ଲାଲ୍ ରଙ୍ଗ ହୁଏ ଏବଂ ଗୋଟିଏ ସମ୍ପୂର୍ଣ୍ଣ ଲାଇନ୍ ହେଲେ ସବୁଜ ରଙ୍ଗ ହୁଏ । ଖେଳାଳି ୧ ଡାକିଥିବା ନମ୍ବର ନୀଳ ରଙ୍ଗରେ ଏବଂ ଖେଳାଳି ୨ ଡାକିଥିବା ନମ୍ବର କମଳା ରଙ୍ଗରେ ଦେଖାଯାଏ । ଶେଷ ଡକାଯାଇଥିବା ନମ୍ବର ଚାରିପାଶରେ ହଳଦିଆ ରିଙ୍ଗ୍ ଦେଖାଯାଏ ।',
    guideSpectatorTitle: '୪. ଲାଇଭ୍ ଦର୍ଶକ ଏବଂ ଇମୋଜି ପ୍ରତିକ୍ରିୟା',
    guideSpectatorDesc: 'ଦର୍ଶକମାନେ ଯେକୌଣସି ରୁମ୍ ରେ ଯୋଗ ଦେଇ ଖେଳାଳି ୧ (ବାମ) ଏବଂ ଖେଳାଳି ୨ (ଡାହାଣ) ଙ୍କ ବୋର୍ଡକୁ ପାଖାପାଖି ଲାଇଭ୍ ଦେଖିପାରିବେ ଏବଂ ଡାହାଣ ପାର୍ଶ୍ୱରେ ଥିବା ଭର୍ଟିକାଲ୍ ପ୍ୟାନେଲରୁ ଇମୋଜି ପ୍ରତିକ୍ରିୟା ପଠାଇପାରିବେ ।',
  },
};
