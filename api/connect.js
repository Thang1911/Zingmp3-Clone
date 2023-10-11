const config = {
  user: "Thang",
  password: "1911",
  server: "127.0.0.1",
  database: "test",
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
    // Nếu không cần xác định instance name, bạn có thể loại bỏ tùy chọn này.
    // instancename: 'SQLEXPRESS',
  },
  port: 51650,
  stream: false,
  parseJSON: false,
  arrayRowMode: false,
  validateConnection: true,
};

module.exports = config;
