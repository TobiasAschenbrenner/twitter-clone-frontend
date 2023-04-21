const UserSearchResults = ({ visible, items }) => {
  if (!visible) {
    return null;
  }

  return (
    <div className="search-dropdown">
      {items.map((user) => (
        <a
          href={`/${user.username}`}
          className="search-result"
          key={user.username}
        >
          <div>
            <img src={user.profile_image_url} alt="avatar" />
          </div>
          <div>
            <h4 className="displayname">{user.displayname}</h4>
            <p className="username">@{user.username}</p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default UserSearchResults;