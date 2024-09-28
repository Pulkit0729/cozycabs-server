module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    await db.collection('bookingPoints').find().forEach(async (mydoc) => {
      db.collection('points').findOne({ pointId: mydoc.pickupId }).then((pickup) => {
        db.collection('points').findOne({ pointId: mydoc.dropId }).then((drop) => {
          if (pickup && drop) {
            db.collection('bookingPoints').updateOne(mydoc, { $set: { pickup: pickup, drop: drop } });
          }
        });
      });

    });

  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    await db.collection('bookingPoints').updateMany({}, { $unset: { pickup: {}, drop: {} } })

  }
};
