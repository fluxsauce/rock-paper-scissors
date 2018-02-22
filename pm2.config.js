module.exports = {
  apps: [
    {
      name: 'server',
      script: './server.js',
      watch: true,
      instance_var: 'INSTANCE_ID',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
