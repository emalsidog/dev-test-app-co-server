const moment = require('moment');

exports.getPeople = (req, res) => {
  const db = req.app.get("db");

  db.serialize(() => {
    const page = req.query.page;
    const limit = 50;
    const offset = (page - 1) * limit;
    db.all("SELECT count(*) FROM users", (error, count) => {
      if (error) {
        throw new Error(error);
      }

      let sql = `SELECT u.id, u.name, u.last_name, u.email, u.gender, u.ip_address, 
                 sum(clicks) AS total_clicks, 
                 sum(page_views) AS total_views
                 FROM users u
                 LEFT JOIN users_statistics s ON u.id = s.user_id
                 GROUP BY id
                 LIMIT ${limit * 1} OFFSET ${offset}`;

      db.all(sql, (error, list) => {
        if (error) {
          throw new Error(error);
        }
        return res.json({
          list,
          count: count[0]["count(*)"],
          limit,
        });
      });
    });
  });
};

exports.getPersonStats = (req, res) => {
  const db = req.app.get("db");
  const id = Number(req.params.id);
  const { from, to } = req.query;

  let checkFrom = moment(from, "YYYY-MM-DD").format("YYYY-MM-DD") === from;
  let checkTo = moment(to, "YYYY-MM-DD").format("YYYY-MM-DD") === to;

  if(!checkFrom || !checkTo) {
    return res.status(400).json({ isError: true, message: "Incorrect date format" });
  }

  const sql = `SELECT clicks, page_views, date
               FROM users_statistics
               WHERE (user_id=${id}) AND (date BETWEEN '${from}' and '${to}')
               GROUP BY date`;
  
  db.serialize(() => {
    db.all(sql, (error, stats) => {
      if (error) throw new Error(error);
      db.all(
        `SELECT name, last_name FROM users WHERE id=${id}`,
        (error, names) => {
          if (error) throw new Error(error);
          return res.json({
            isError: false,
            stats,
            names,
          });
        }
      );
    });
  });
};