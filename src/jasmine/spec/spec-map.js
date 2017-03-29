$(function() {
    describe('Map Api', function() {
        it('initMap is defined', function() {
            expect(initMap).toBeDefined();
            expect(typeof initMap).toContain('function')
        })
        it('js api is defined', function(){
            expect(google.maps).toBeDefined();
        })
    });
    describe('KnockOut', function() {
        /** 
         * model is defined
         * model has ...
         * 
         */
        
    });
    
}());
