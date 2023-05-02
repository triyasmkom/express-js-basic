const express = require("express")
const request = require('supertest')

describe('Routing', function () {
    const app = express()
    app.get('/', (req, res)=>{
        res.send('Hello World!')
    })

    test('Hello World', async ()=>{
        const response = await request(app).get("/")
        expect(response.text).toBe('Hello World!')
    })
});

describe('Request', function () {
    test('Query Parameter',async ()=>{
        const app = express();
        app.get('/', (req, res)=>{
            res.send(`Hello ${req.query.name}`)
        })

        const response = await request(app)
            .get('/')
            .query({name:'World'})

        expect(response.text).toBe('Hello World')
    })

    test('URL Information', async ()=>{
        const app = express()

        app.get('/hello/world', (req, res)=>{
            res.json({
                path: req.path,
                originalUrl: req.originalUrl,
                hostname: req.hostname,
                protocol: req.protocol,
                secure: req.secure
            })
        })

        const response = await request(app)
            .get('/hello/world')
            .query({name:'World'})

        expect(response.body).toEqual({
            path: '/hello/world',
            originalUrl: '/hello/world?name=World',
            hostname: '127.0.0.1',
            protocol: 'http',
            secure: false
        })
    })

    test('Header', async ()=>{
        const app = express()
        app.get('/', (req, res)=>{
            const type = req.get('Accept')
            res.send(`Hello ${type}`)
        })

        const response = await request(app).get('/').set('Accept', 'text/plain')

        expect(response.text).toBe('Hello text/plain')
    })
});

describe('Response', function () {
    test('Send',async ()=>{
        const app = express();
        app.get('/', (req, res)=>{
            res.send(`Send Response`)
        })

        const response = await request(app).get('/')

        expect(response.text).toBe('Send Response')
    })

    test('Response Status', async ()=>{
        const app = express()
        app.get('/', (req, res)=>{
            if (req.query.name){
                res.status(200).send(`Hello ${req.query.name}`)
            } else {
                res.status(400).end()
            }
        })

        let response = await request(app).get('/').query({name:'test'})

        expect(response.status).toBe(200)
        expect(response.text).toBe('Hello test')

        response = await request(app).get('/')
        expect(response.status).toBe(400)
    })

    test('Response Header', async ()=>{
        const app = express()
        app.get('/', (req, res)=>{
            res.set({
                'X-Powered-By':'Study Independent',
                'X-Author':'Triyas'
            }).end()
        })

        const response = await request(app).get('/')

        expect(response.get('X-Powered-By')).toBe('Study Independent')
        expect(response.get('X-Author')).toBe('Triyas')
    })

    test('Response Body', async ()=>{
        const app = express()
        app.get('/', (req, res)=>{
            res.set('Content-Type', 'text/html')
            res.send('<html><head><title>Hello Html</title></head></html>')
        })

        const response = await request(app).get('/')
        expect(response.get('Content-Type')).toContain('text/html')
        expect(response.text).toBe('<html><head><title>Hello Html</title></head></html>')
    })
});





