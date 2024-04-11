import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai'; 
import { Card, Form, Alert, Button } from 'react-bootstrap';
import { getToken, authenticateUser } from '@/lib/authenticate';
import { getFavourites, getHistory } from '@/lib/userData';
import { favouritesAtom, searchHistoryAtom } from '@/store';

export default function Login() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [warning, setWarning] = useState('');
  const [, setFavouritesList] = useAtom(favouritesAtom);
  const [, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();

  async function updateAtoms() {
    setFavouritesList(await getFavourites());
    setSearchHistory(await getHistory());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await authenticateUser(user, password);
      await updateAtoms(); 
      router.push('/favourites'); 
    } catch (err) {
        console.error("Error during form submission:", err);
        setWarning(err.message || 'An error occurred');
    }
  }

  return (
    <>
      <Card bg="light">
        <Card.Body>
          <h2>Login</h2>
          Enter your login information below:
        </Card.Body>
      </Card>

      <br />

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>User:</Form.Label>
          <Form.Control
            type="text"
            value={user}
            id="userName"
            name="userName"
            onChange={e => setUser(e.target.value)}
          />
        </Form.Group>

        <br />

        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            id="password"
            name="password"
            onChange={e => setPassword(e.target.value)}
          />
        </Form.Group>

        <br />

        {warning && (
          <>
            <Alert variant="danger">{warning}</Alert>
            <br />
          </>
        )}

        <Button variant="primary" type="submit">Login</Button>

      </Form>
    </>
  );
}
