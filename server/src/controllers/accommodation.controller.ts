import { Reference, wrap } from "@mikro-orm/core";
import { Router } from "express";
import { Accommodation } from "../entities/Accommodation";
import { Message } from "../entities/Message";
import { Reservation } from "../entities/Reservation";
import { Role, User } from "../entities/User";
import multer from "multer";

export const accommodationRouter = Router();

const MIME_TYPE_MAP: any = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const config = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        if (isValid) {
            cb(null, "uploads");
        } else {
            console.log("nope")
            let error = new Error("Nem támogatott formátum.")
            cb(error, "uploads");
        }
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + extension);
    }
});

const upload = multer({ storage: config })

accommodationRouter
    .use((req, res, next) => {
        req.accommodationRepository = req.orm.em.getRepository(Accommodation);
        req.reservationRepository = req.orm.em.getRepository(Reservation);
        req.messageRepository = req.orm.em.getRepository(Message);
        next();
    })

    //egy szállás lekérdezése
    .get('/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        const accommodation = await req.accommodationRepository!.findOne({ id, confirmed: true });
        if (accommodation) {
            res.send(accommodation);
        } else {
            res.sendStatus(404);
        }
    })

    //user által kiadott szállások lekérdezése
    .get('/all/:role', async (req, res) => {
        const role = String(req.params.role);

        if (role == "MEMBER") {
            const accommodations = await req.accommodationRepository!.find({ user: req.user!.id, confirmed: true }, { populate: ['reservations'] })
            res.send(accommodations);
        } else {
            const accommodations = await req.accommodationRepository!.find({ confirmed: false }, { populate: ['user'] });
            res.send(accommodations);
        }
    })


    //szállás bejelentése
    .post('/', upload.single("image"), async (req, res) => {
        //kép elérése útvonala
        const url = req.protocol + '://' + req.get("host");

        const accommodation = new Accommodation();

        //wrap(accommodation).assign(req.body, { em: req.orm.em });
        accommodation.name = req.body.name;
        accommodation.phone_number = req.body.phone_number;
        accommodation.description = req.body.description;
        accommodation.information = req.body.information;
        accommodation.services = JSON.parse(req.body.services);
        accommodation.adult_price = req.body.adult_price;
        accommodation.child_price = req.body.child_price;

        //accommodation.image = url + "/uploads/" + req.file?.filename;
        //dev mode
        accommodation.image = req.protocol + '://' + 'localhost:3000' + "/uploads/" + req.file?.filename;

        accommodation!.user = req.orm.em.getReference(User, req.user!.id);
        accommodation!.user = req.orm.em.getReference(User, req.user!.id);

        //place: string átalakítása
        const place = req.body.place;
        const modifiedPlace = place.charAt(0).toUpperCase() + place.slice(1).toLowerCase();
        accommodation.place = modifiedPlace;
        
        if (req.body.res_end_date) {
            accommodation.res_end_date = new Date(req.body.res_end_date);
        } else {
            //maximum: explicit dátum
            accommodation.res_end_date = new Date('2025-01-01');
        }

        await req.accommodationRepository!.persistAndFlush(accommodation);
        res.sendStatus(200);
    })

    //szállás aktiválása, inaktiválása
    .put('/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        const accommodation = await req.accommodationRepository!.findOne({ id: id });
        if (!accommodation) {
            res.sendStatus(409);

        } else {
            if (accommodation.active) {
                accommodation.active = false;

            } else {
                accommodation.active = true;
            }
            await req.accommodationRepository!.persistAndFlush(accommodation!);
            res.sendStatus(200);
        }
    })

    .delete('/:id', async (req, res) => {
        const id = parseInt(req.params.id);

        const accommodation = await req.accommodationRepository!.findOne({ id: id });
        const userid = accommodation!.user.id;
        const name = accommodation!.name;

        const deleteaccommodation = await req.accommodationRepository!.nativeDelete({ id: id });
        if (deleteaccommodation) {

            const message = new Message();
            message.createdAt = new Date().toISOString().slice(0, 10);
            message.text1 = 'A szálláshirdetését nem fogadták el  >>  szállás:  ' + name + ' .';
            message.text2 = 'Panasz esetén vegye fel a kapcsolatot velünk!'
            message.user = userid;
            await req.messageRepository!.persistAndFlush(message);

            res.sendStatus(200);
        } else {
            res.sendStatus(409);
        }
    })

    //szállás elfogadása(confirmálása)
    .put('/confirm/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        const accommodation = await req.accommodationRepository!.findOne({ id: id });
        if (!accommodation) {
            res.sendStatus(409);

        } else {
            if (!accommodation.confirmed) {
                accommodation.confirmed = true;

                const message = new Message();
                message.createdAt = new Date().toISOString().slice(0, 10);
                message.text1 = 'A szálláshirdetése elfogadásra került  >>  szállás:  ' + accommodation!.name + ' .';
                message.text2 = 'Gratulálunk, mostmár fogadhat vendégeket!'
                message.user = accommodation!.user.id;
                await req.messageRepository!.persistAndFlush(message);
            }
            await req.accommodationRepository!.persistAndFlush(accommodation!);
            res.sendStatus(200);
        }
    })