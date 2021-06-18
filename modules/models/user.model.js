const { v4: uuid } = require('uuid');
const { Pool } = require('pg');

class Users {
  constructor(usersTable, rolesTable) {
    this.usersTable = usersTable;
    this.rolesTable = rolesTable;
  }

  connectCloud(url) {
    this.pool = new Pool({
      connectionString: url,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }

  findOne(key, val) {
    if (!key || !val) {
      return null;
    }
    const sql = `SELECT users.id, users.login, users.hash, users.salt, roles.role FROM roles JOIN users ON users.role_id=roles.id WHERE users.${key}=$1`;
    return this.pool.query(sql, [val]).then((data) => data.rows[0]);
  }

  getUserByLogin(login) {
    return this.pool.query(
      'SELECT id, login, hash, salt FROM users WHERE login=$1',
      [login]
    );
  }

  getUserById(id) {
    return this.pool.query(
      'SELECT id, login, hash, salt FROM users WHERE id=$1',
      [id]
    );
  }

  getUserPayload(id) {
    const sql = 'SELECT roles.role, users.id FROM roles LEFT JOIN users ON users.role_id = roles.id WHERE users.id=$1;';
    return this.pool.query(sql, [id]);
  }

  getRoles() {
    return this.pool.query('SELECT * FROM roles');
  }

  getRole(roleName) {
    return this.pool.query('SELECT * FROM roles WHERE role=$1', [roleName]);
  }

  create(login, hash, salt, role = 'client') {
    // const { hash, salt } = PCrypt.setHash(password);

    // const user = {
    //   id: uuid(),
    //   role,
    //   login,
    //   hash,
    //   salt
    // };
    const roleId = role === 'admin' ? 1 : 2;
    const params = [uuid(), roleId, login, hash, salt];
    const sql = 'INSERT INTO users(id, role_id, login, hash, salt) values($1, $2, $3, $4, $5) RETURNING id, login';
    return this.pool.query(sql, params).then((data) => data.rows[0]);
  }

  changeLogin(id, login) {
    return this.pool.query(
      'UPDATE users SET login=$1 WHERE users.id=$2 RETURNING login',
      [login, id]
    );
  }

  changePassword(id, password) {
    const { hash, salt } = this.setHash(password);
    return this.pool.query(
      'UPDATE users SET hash=$1,salt=$2 WHERE users.id=$3 RETURNING id',
      [hash, salt, id]
    );
  }

  changeRole(id, roleId) {
    return this.pool.query(
      'UPDATE users SET role_id=$1 WHERE users.id=$2 RETURNING id',
      [roleId, id]
    );
  }

  getAll() {
    return this.pool.query('SELECT id,role_id,login FROM users').then((data) => data.rows);
  }
}

const userModel = new Users(process.env.DB_USERS_TABLE, process.env.DB_ROLE_TABLE);

module.exports = userModel;
