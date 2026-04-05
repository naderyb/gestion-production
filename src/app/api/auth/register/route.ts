import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nom, email, mot_de_passe, role } = body;

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    const [result]: any = await pool.query(
      'INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)',
      [nom, email, hashedPassword, role]
    );

    return Response.json({ id: result.insertId, message: 'Utilisateur créé avec succès' }, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}