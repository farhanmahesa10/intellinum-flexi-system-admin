interface config {
  prefixUrl: string;
  expressUrl: string;
  theme: string;
  language: string;
  token: string;
}

export const Config: config = {
  prefixUrl: localStorage.getItem("prefixUrlSystemAdmin"),
  expressUrl: "https://expresslabel2.intellinum.com",
  theme: "light",
  language: "en",
  token:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJPREwtUFJPRCIsIm5iZiI6MTcwOTIzMTM0MiwiZXhwIjoyMzQwMzgzMzQyLCJpYXQiOjE3MDkyMzEzNDIsImlzcyI6IkV4cHJlc3NMYWJlbFNlcnZlciIsImF1ZCI6IkV4cHJlc3NMYWJlbENsaWVudCJ9.mB5RrnK6Yu12YODNQjpE6dytLAck9LZVmF7Cm6laqkE",
};
