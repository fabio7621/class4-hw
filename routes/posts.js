var express = require("express");
const errorHandle = require("../errorHandle");
var router = express.Router();
const Post = require("../models/postsModel");
const User = require("../models/usersModel");

router.get("/", async function (req, res, next) {
	try {
		const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
		const q =
			req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
		const posts = await Post.find(q)
			.populate({
				path: "user",
				select: "name image",
			})
			.sort(timeSort);
		res.status(200).json({
			success: true,
			message: "搜尋成功",
			posts,
		});
	} catch {
		errorHandle(res, error);
	}
});

router.post("/", async function (req, res, next) {
	try {
		const newPost = await Post.create(req.body);
		res.status(200).json({
			status: "success",
			posts: newPost,
		});
	} catch (error) {
		errorHandle(res, error);
	}
});

router.delete("/", async (req, res, next) => {
	try {
		await Post.deleteMany({});
		res.status(200).json({
			status: "success",
			posts: [],
		});
	} catch (error) {
		errorHandle(res, error);
	}
});

router.delete("/:id", async (req, res, next) => {
	try {
		const post = await Post.findByIdAndDelete(req.params.id);
		res.status(200).json({
			status: "success",
			posts: post,
		});
	} catch (error) {
		errorHandle(res, error);
	}
});

router.patch("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const { body } = req;
		const updatedPost = await Post.findByIdAndUpdate(id, body, { new: true });
		res.status(200).json({
			status: "success",
			posts: updatedPost,
		});
	} catch (error) {
		errorHandle(res, error);
	}
});

module.exports = router;
