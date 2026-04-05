import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM clients ORDER BY created_at DESC');
    return Response.json(rows);
  } catch (error) {
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { nom, email, telephone, adresse } = body;

    const [result] = await pool.query(
      'INSERT INTO clients (nom, email, telephone, adresse) VALUES (?, ?, ?, ?)',
      [nom, email, telephone, adresse]
    );

    return Response.json({ id: result.insertId, message: 'Client créé avec succès' }, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}