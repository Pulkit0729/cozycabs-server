module.exports = {
  async up(db) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    await db.collection('rides').find().forEach((mydoc) => { db.collection('rides').updateOne(mydoc, { $set: { departure_time: mydoc.time, arrival_time: mydoc.time } }) });
    await db.collection('templatedRides').find().forEach((mydoc) => { db.collection('templatedRides').updateOne(mydoc, { $set: { departure_time: mydoc.time, arrival_time: mydoc.time } }) });
    await db.collection('bookings').find().forEach((mydoc) => { db.collection('bookings').updateOne(mydoc, { $set: { departure_time: mydoc.time, arrival_time: mydoc.time } }) });
  },

  async down(db) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    console.log(db);
    await db.collection('rides').updateMany({}, { $unset: { departure_time: "", arrival_time: "" } })
    await db.collection('templatedRides').updateMany({}, { $unset: { departure_time: "", arrival_time: "" } })
    await db.collection('bookings').updateMany({}, { $unset: { departure_time: "", arrival_time: "" } })

  }
};
