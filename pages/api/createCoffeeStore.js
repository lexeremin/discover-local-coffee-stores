import { table, getMinifiedRecords, findRecordByFilter } from "../../lib/airtable";




const createCoffeeStore = async (req, res) => {

    if(req.method === "POST") {

        const {id, name, neighbourhood, address, imgUrl, voting} = req.body;

        try {
            if(id) {
                const records = await findRecordByFilter(id);
                if(records.length !==0) {
                    res.json(records)
                } else {
                    if(name) {
                        const createRecords = await table.create([
                            {
                                fields: {
                                    id,
                                    name,
                                    address,
                                    neighbourhood,
                                    voting,
                                    imgUrl,
        
                                },
                            }
                        ]);
                        const records = getMinifiedRecords(createRecords)
                        res.json(records)
                    } else {
                        res.status(400);
                        res.json({message: "no id or name"})
                    }
                }
            }
        } catch (err) {
            console.error("error finding store", err);
            res.status(500);
            res.json({message: "Something went wrong"});
        }
        
    }

};

export default createCoffeeStore;