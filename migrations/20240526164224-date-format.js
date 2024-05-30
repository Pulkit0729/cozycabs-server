module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    await db.collection('rides').find().forEach((mydoc) => {
      let dateArray = mydoc.date.split('.');
      let date = new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]);
      db.collection('rides').updateOne(mydoc, { $set: { date: date, dateOld: mydoc.date } })
    });
    await db.collection('bookings').find().forEach((mydoc) => {
      let dateArray = mydoc.date.split('.');
      let date = new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]);
      db.collection('bookings').updateOne(mydoc, { $set: { date: date, dateOld: mydoc.date } })
    });
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    await db.collection('rides').find().forEach((mydoc) => { db.collection('rides').updateOne(mydoc, { $set: { date: mydoc.dateOld }, $unset: { dateOld: mydoc.date } }) });
    await db.collection('bookings').find().forEach((mydoc) => { db.collection('bookings').updateOne(mydoc, { $set: { date: mydoc.dateOld }, $unset: { dateOld: mydoc.date } }) });

  }
};
