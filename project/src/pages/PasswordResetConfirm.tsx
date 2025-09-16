import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function PasswordResetConfirm() {
  const [params] = useSearchParams();
  const uid = params.get('uid') || '';
  const token = params.get('token') || '';
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password1 !== password2) {
      return setError("Passwords don't match");
    }
    try {
      const res = await fetch('/api/password/reset/confirm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, token, new_password1: password1, new_password2: password2 }),
      });
      if (res.ok) navigate('/reset-password/complete');
      else throw new Error('Failed to reset password');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Set a New Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded-lg"
        />
        <button className="w-full bg-green-600 text-white p-2 rounded-xl hover:bg-green-700">
          Reset Password
        </button>
        {error && <p className="mt-2 text-red-600">{error}</p>}
      </form>
    </div>
  );
}