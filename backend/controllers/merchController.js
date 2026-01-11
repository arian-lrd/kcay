const getMerch = async (req, res, next) => {
    try {
        // Placeholder response - will be fully developed later
        res.json({
            message: "Stay tuned! Our exclusive merchandise collection is coming soon.",
            subtitle: "Get ready to represent with style",
            comingSoon: true,
            items: []
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMerch
};

