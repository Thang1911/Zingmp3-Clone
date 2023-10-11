class Book {
  constructor(id, title, desc, cover) {
    this.id = id;
    this.title = title;
    this.desc = desc;
    this.cover = cover;
  }
}

class User {
  constructor(userId, name, password, email, role) {
    this.userId = userId;
    this.name = name;
    this.password = password;
    this.email = email;
    this.role = role;
  }
}

class Playlists {
  constructor(PlaylistsID, PlaylistName, UserID) {
    this.PlaylistsID = PlaylistsID;
    this.PlaylistsName = PlaylistsName;
    this.UserID = UserID;
  }
}

module.exports = { Book: Book, User: User, Playlists: Playlists };
