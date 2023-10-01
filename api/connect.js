const config = {
  user: "Thang",
  password: "1911",
  server: "127.0.0.1",
  database: "test",
  options: {
    trustedconnnection: true,
    enableArithAbort: true,
    instancename: "SQLEXPRESS",
  },
  trustServerCertificate: true,
  port: 51650,
};

module.exports = config;
