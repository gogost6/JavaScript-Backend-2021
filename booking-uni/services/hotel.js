const Hotel = require('../models/Hotel');
const User = require('../models/User');

async function getAll() {
    const hotels = Hotel.find({}).sort({ freeRooms: 1 }).lean();
    return hotels;
}

async function create(hotel) {
    const record = new Hotel(hotel);
    return record.save();
}

async function getById(id) {
    const hotel = Hotel.findOne({ _id: id }).lean();
    return hotel;
}

async function edit(id, data) {
    let record = await Hotel.findByIdAndUpdate({ _id: id }, data);
    return record.save();
}

async function deleteHotel(id) {
    await Hotel.findByIdAndRemove({ _id: id }, (err) => {
        if (err) {
            console.log(err);
        }
        console.log("Successful deletion");
    });
}

async function book(id, username) {

    const hotel = await Hotel.findOne({ _id: id });
    const user = await User.findOne({ username });

    if (!hotel || !user) {
        throw new ReferenceError('Wrong data!');
    }

    if (hotel.freeRooms == 0) {
        throw new ReferenceError('No free rooms left!');
    }

    hotel.freeRooms -= 1;
    hotel.bookedUsers.push(user);
    hotel.save();
    user.bookedHotels.push(hotel);
    return user.save();
}

async function offered(name, username) {
    const hotel = await Hotel.findOne({ hotel: name });
    const user = await User.findOne({ username });

    if (!hotel || !user) {
        throw new ReferenceError('Wrong data!');
    }
    user.offeredHotels.push(hotel);
    return user.save();
}

module.exports = {
    create,
    getAll,
    getById,
    edit,
    deleteHotel,
    book,
    offered
}