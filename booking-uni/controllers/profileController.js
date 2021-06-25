const router = require('express').Router();

router.get('/:username', async (req, res) => {
    const profile = await req.user.getUserByUsername(req.params.username);
    let arr = [];

    for (let index = 0; index < profile.bookedHotels.length; index++) {
        const id = profile.bookedHotels[index]
        let hotel = await req.storage.getById(id);
        if(hotel != null) {
            arr.push(`${hotel.hotel} ${hotel.city}`);
        }
    }

    const viewModel = {
        username: profile.username,
        email: profile.email
    }

    const data = {
        username: viewModel.username,
        email: viewModel.email,
        hotels: arr.join(', ')
    }

    // console.log(data);
    res.render('profile', data);
});

module.exports = router;