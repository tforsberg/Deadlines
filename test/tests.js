describe("server", function() {
    beforeEach(function(){
        var db = {},
            missingTask = {},
            savedTask = {};
    });

    it("returns a task id on create request", function() {
        var a = 'test';
        expect(a).toEqual('test');
    });

    xit("can remove a task from db", function(){
        pending("test implementation");
    });

    xit("can save a task to db", function(){
        pending('test implementation');
    });

    xit("can send array of all tasks", function(){
        pending('test implementation');

    });

    xit("saves task on put request to /task", function(){
        pending('test implementation');

    })

    xit("deletes task on delete request to /task", function(){

        pending('test implementation');
    })
});

describe("mongodb", function(){
    beforeEach(function(){
       var mongoDB = {};
    });


    xit("can remove a task", function(){
        pending('test implementation');

    });

    xit("can add a task", function(){
        pending('test implementation');

    });

    xit("can return an array of all tasks", function(){
        pending('test implementation');

    });
})