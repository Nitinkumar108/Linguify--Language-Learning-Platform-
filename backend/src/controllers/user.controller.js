import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';
export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user._id;
        const currentUser=req.user;

        const recommendedUsers = await User.find({
            $and:[
                { _id: { $ne: currentUserId } }, // Exclude current user
                { _id: { $nin: currentUser.friends } }, // Exclude friends
                {isOnboarded: true}, // Only include onboarded users
            ]
        });

        res.status(200).json(recommendedUsers);
           

    } catch (error) {
        console.error("Error fetching recommended users:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getMyFriends(req, res) {
  try {
    const user=await User.findById(req.user._id).select("friends").populate('friends', 'fullName profilePic nativeLanguage learningLanguage');

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error fetching friends that is in getMyfrined controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" }); 
  }
}

export async function sendFriendRequest(req, res) {
    try {
        const myId=req.user.id;
        const{id: recipientId}=req.params;

        //prevent sending friend request to self
        if(myId === recipientId) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself."});
        }

        const recipient = await User.findById(recipientId);
        if(!recipient) {
            return res.status(404).json({ message: "Recipient not found." });
        }
        // Check if a friend request already exists
        const existingRequest = await FriendRequest.findOne(
            {
                 $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId },
                      ],
            }
        );

        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already exist between you and this person" });
        }

        // Create a new friend request
        const friendRequest=await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });
        res.status(201).json(friendRequest);
    } catch (error) {
        console.error("Error sendFriendRequest  controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const{id:requestId}=req.params;

        const friendRequest = await FriendRequest.findById(requestId);
        if(!friendRequest) {
            return res.status(404).json({ message: "Friend request not found." });
        }

        // Check if the current user is the recipient of the friend request
        if(friendRequest.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request." });
        }
        friendRequest.status = 'accepted';
        await friendRequest.save();
        // Add each other to friends list
        await User.findByIdAndUpdate(friendRequest.sender, { $addToSet: { friends: friendRequest.recipient } });
        await User.findByIdAndUpdate(friendRequest.recipient, { $addToSet: { friends: friendRequest.sender } });

        res.status(200).json({ message: "Friend request accepted successfully." });
    } catch (error) {
        console.error("Error accepting friend request:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }

}

export async function getFriendRequest(req, res) {
    try {
        
        const incomingRequests = await FriendRequest.find({ recipient: req.user._id, status: 'pending' })
            .populate('sender', 'fullName profilePic nativeLanguage learningLanguage'); 

        const acceptedRequests = await FriendRequest.find({ sender: req.user._id, status: 'accepted' })
            .populate('recipient', 'fullName profilePic ');

            res.status(200).json({
                incomingRequests,
                acceptedRequests
            });
    } catch (error) {
        console.error("Error in getPendingRequest controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

export async function getOutgoingFriendRequest(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({ sender: req.user._id, status: 'pending' })
            .populate('recipient', 'fullName profilePic nativeLanguage learningLanguage');  

            res.status(200).json(outgoingRequests);
    } catch (error) {
        console.error("Error in getOutgoingFriendRequest controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}