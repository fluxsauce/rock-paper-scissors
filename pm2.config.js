module.exports = {
  apps: [
    {
      name: 'web',
      script: './servers/web/index.js',
      watch: true,
      instance_var: 'INSTANCE_ID',
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'games',
      script: './servers/games/index.js',
      watch: true,
      instance_var: 'INSTANCE_ID',
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'players',
      script: './servers/players/index.js',
      watch: true,
      instance_var: 'INSTANCE_ID',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
