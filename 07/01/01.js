  console.log(worker(3,2,'-'));
  console.log(worker(4,2,'+'));
  console.log(worker(2,3,'*'));
  console.log(worker(3,3,'/'));
  console.log(worker(12,5,'%'));

    function worker(a,b,operator){
        switch(operator){
            case '+':
                return a + b;
                break;

            case '-':
                return a - b;
                break;

            case '*':
            return a * b;
                break;

            case '/':
            return a / b;
                break;
            
            case '%':
                return a % b;
                break;

            default:
                return 0;
        }
    }