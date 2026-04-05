import pool from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { statut, date_debut, date_fin } = body;

    await pool.query(
      'UPDATE ordres_fabrication SET statut=?, date_debut=?, date_fin=? WHERE id=?',
      [statut, date_debut, date_fin, id]
    );

    if (statut === 'termine') {
      const [ordre] = await pool.query(
        'SELECT * FROM ordres_fabrication WHERE id=?', [id]
      );

      await pool.query(
        'UPDATE produits SET stock = stock + ? WHERE id=?',
        [ordre[0].quantite, ordre[0].produit_id]
      );

      const [autresOrdres] = await pool.query(
        'SELECT * FROM ordres_fabrication WHERE commande_id=? AND statut != "termine"',
        [ordre[0].commande_id]
      );

      if (autresOrdres.length === 0) {
        await pool.query(
          'UPDATE commandes SET statut="livree" WHERE id=?',
          [ordre[0].commande_id]
        );
      }
    }

    return Response.json({ message: 'Ordre de fabrication mis à jour' });
  } catch (error) {
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}