import mongoose from 'mongoose';

const def='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAYFBMVEXl5uivtLi5vsHn6euutLmutLissbXm5uarr7Kxtbjl6Ovq6+3j5+jo6OqvsrWwtLbOz9HAxcjd3uDS19rT1dfHy86+wsW3urzO1Nivr7HDw8Xa3d+nr7XLy83f3+Ha3uOw42IDAAAEi0lEQVR4nO3c2XLjKhQFUGFkAsigWViWY///XzZyJx3f3MQW8oCOa6+8pLrywC6kwyDoJAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYNGN45nFjYrfkEYze1G3nGGPKlcWg+YulzJLCSWktY2uf0VppV03yQhmzYycEUyM2dqJSVjHBWh27YXdikm6fpin7DPg3qv8XIYrYbbsL3vS5j5Ou/5cwTXtX0e9HXUp2gdiSj6jEpYCMyTaL3cSbHJS9HNAX1h3pmqryawGZ6nd0e5G7/HpCZiXZYUOXV97BT6KmGdHUEwP6iLHbOtPUfH4qt6L4KvLdhHfwk2zoFVQ9XBzpv1P03kS+StfTA6b7LY/d4lBH4Sfb0xOmjtxiqhQBAX1CMcRucSjFwhIyYjMbXcuPpdJEillatSYrbVDCcdlP6zHlTgUnbElVUy1DE+ZqRSrhYMOfUkVpuDBFQLpP4hC72QFMOychpVLDyzkJ69jNDsC7kOH+M2ETu9kBTDenD2klDFhXEE348n04q9JQqqWmnbwJdZawojTkN8EJlWCxGx2kCp6X+lkbqXmpnjEv7UglzFbBCeU2dqOD6G3YGn9MSGuNnyQyaJ/GTxAcqYd03C4N3Iki903f1KG7ibFbHEyzsB3hkthDOtaafciuvjjGbnA4ffUL/ofx7Iml14VeM/Hj05hQxm7sLHziEsoHFAQ/H442UxMSm7B9mfiR1M+5NdGECS/66+VG9T25T4dffMSrCfO+it3MW2TFtaXwWpIO6CNeO1SjNrGbeCt9/O10op/U5bLU1BZNPzDv8pcTtCJvqBbR/+KH8Zj3t1PQbDzoHbtl96Or1kr1FdFaK13xCg/ouaFVVpxIaV17eMFrJTzTVV1vt/Vw0PzFui85XQgyf28Djb9l/udlulBr7fuuKdpu5VRuT5RyXdk2le9K4p1pEp4ct6USUozF9GvN739bj28k69pa0zoLdY6bqtjZfXrZXrj3wdAbFv2jWbVO+icyXV+JeLrntatpPa+Gbwolp+7TnEhVVmQu7Gk+dNKGfXsaF/p2VWsSkwB+XH1cxQsKOP69UARuQZnKjbVFzUl4ei0XfvFSJ51kvrbMOIlxsmapdMOCaw4vrA2qLz/2pi2XmpBXToR9F/05oa85zSJnAVnT29DX7+eESvVLvLFndr29V8Lc9i52nu9M4macoLlEDBsvdq5/zCG/c0AmRLOchJvNMOUmZai84MtJKB+QUOWyWEzCPH9IH+Z2KZuNtw6Bv0p9uYkdLhkvj9y7yJzJF5DQvF//vDRbOp4jij34V/0DXsF/8vw99rpYq0cUmbOIMvI9E93ePte+xE/DXdyVhg7drQhOqGQdc8gwbeBJ2RkJVdwbX/YJCW20wzZvCZ9zJD84JFvx5O0tUsJHdt8XOURLGPbfJszXxkpoilu3nSZSWayE7kkJ5SFOwiQRszdGg6Sx7l6a4WkJY11kL56VMI10kd2Phs9KGOsuRrt6mkgJDX+W2ItgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAV/IHO7ZB8tqVMJUAAAAASUVORK5CYII=';
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:3,
        maxLength:30

    },    
    password:{
        type: String,
        required: true,
        minLength:6
    },
    username:{
        type:String,
        required:true,
        trim:true
    },
    pfp:{
        type:String,
        default:def
    }
});

const userModel = mongoose.model('userModel', userSchema);

export { userModel };