import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getRecommendedUsers, getMyFriends, sendFriendRequest,acceptFriendRequest,getFriendRequest, getOutgoingFriendRequest} from '../controllers/user.controller.js';
const router = express.Router();

//apply auth middleware to all the routes given below
router.use(protectRoute);

router.get("/",getRecommendedUsers);
router.get("/friends",getMyFriends);

router.post("/friend-request/:id",sendFriendRequest)
router.put("/friend-request/:id/accept",acceptFriendRequest)

router.get("/friend-requests", getFriendRequest);
router.get("/outgoing-friend-requests/:id", getOutgoingFriendRequest);

export default router;