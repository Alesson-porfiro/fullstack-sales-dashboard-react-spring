import { useEffect, useState } from "react";



function Users() {
  const [users, setUsers] = useState([]);

  // Exemplo com dados mockados
  useEffect(() => {
    const mockUsers = [
      { id: 1, name: "Alesson", email: "alesson@email.com" },
      { id: 2, name: "Maria", email: "maria@email.com" },
      { id: 3, name: "João", email: "joao@email.com" },
    ];
    setUsers(mockUsers);
  }, []);

  return (
    <div className="users-page">
      <h2>👤 Lista de Usuários</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
