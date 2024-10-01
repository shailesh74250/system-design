// Implement health checks to monitor the state of your application and its dependencies.

// src/index.ts
app.get('/health', async (req: Request, res: Response) => {
    try {
        await getConnection().connect();
        res.status(200).send('OK');
    } catch (error) {
        res.status(500).send('Database connection failed');
    }
});
