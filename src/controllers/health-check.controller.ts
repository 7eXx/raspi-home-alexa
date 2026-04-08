
import { Request, Response } from 'express';

class HealthCheckController {

    public healthCheck (req: Request, res: Response) {
        res.status(200).json({
            status: 'OK'
        });
    }
}

export default new HealthCheckController();