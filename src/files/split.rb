#split.rb
require 'rails'
words = File.read('queue_collins_1.txt').each_line
i = 0
temp = []
list_i = 1
words.each do |word|
  word.strip!

  if temp.size < 150
    temp.push word 
    i += 1
  else
    File.open("list_#{list_i}.txt", 'w') do |io|
      temp.each do |w|
        io.puts w
      end
    end
    File.open("list_#{list_i}.json", 'w') do |io|
      io.puts temp.to_json
    end
    i = 0
    list_i += 1
    temp = []
    temp.push word 
  end
end
    list_i += 1
File.open("list_#{list_i}.txt", 'w') do |io|
      temp.each do |w|
        io.puts w
      end
    end
    File.open("list_#{list_i}.json", 'w') do |io|
      io.puts temp.to_json
    end
    
        File.open("queue_collins_1.json", 'w') do |io|
      io.puts words.map(&:strip).to_json
    end
#File.open("thesaurus.json", 'w') {|io| io.puts $thesaurus.to_json}
