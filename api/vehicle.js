// 🔥 ADIBHAI VEHICLE API
// RC number daalo, vehicle info paao

module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // 🔥 Input lo
    let rc = req.query.rc || req.query.vehicle || req.query.number;
    if (req.method === 'POST' && req.body) {
        rc = req.body.rc || req.body.vehicle || req.body.number || rc;
    }

    // 🔥 RC check
    if (!rc) {
        return res.status(400).json({
            status: false,
            error: 'RC number required',
            usage: '/api/vehicle?rc=DL01AB1234',
            developer: '@Hackerwibes2'
        });
    }

    // 🔥 Clean RC
    const cleanRC = String(rc).replace(/\s/g, '').toUpperCase();

    try {
        // 🔥 Upstream API call
        const upstreamUrl = `https://vehicle-eight-vert.vercel.app/api?rc=${encodeURIComponent(cleanRC)}`;

        const response = await fetch(upstreamUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10)',
                'Accept': 'application/json'
            }
        });

        const text = await response.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            data = { raw: text };
        }

        return res.status(200).json({
            status: response.ok,
            rc: cleanRC,
            upstream_status: response.status,
            data: data,
            developer: '@Hackerwibes2',
            api_name: 'Adibhai Vehicle API'
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            rc: cleanRC,
            error: error.message.substring(0, 200),
            developer: '@Hackerwibes2'
        });
    }
};
