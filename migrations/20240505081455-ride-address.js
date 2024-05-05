module.exports = {
  async up(db) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    await db.collection('rides').find().forEach((mydoc)=>{db.collection('rides').updateOne(mydoc, {$set:{from_address:mydoc.from, to_address: mydoc.to}})});
    await db.collection('templatedRides').find().forEach((mydoc)=>{db.collection('templatedRides').updateOne(mydoc, {$set:{from_address:mydoc.from, to_address: mydoc.to}})});
  },

  async down(db) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    console.log(db);
    await db.collection('rides').updateMany({}, {$unset:{from_address:"", to_address:""}})
    await db.collection('templatedRides').updateMany({}, {$unset:{from_address:"", to_address:""}})
  
  }
};
