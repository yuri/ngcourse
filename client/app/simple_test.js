describe('tasks', function () {
  // Define a test.
  it('2*2 should equal 4', function () {
    var x;
    // Do something.
    x = 2 * 2;
    // Check that the results are what we expect and throw an error if something is off.
    if (x!==5) {
      throw new Error('Failure of basic arithmetics.')
    }
  });
});